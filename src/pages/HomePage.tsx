import { useMemo, useState } from "react";

import {
  Card,
  Grid,
  Metric,
  Text,
  Subtitle,
  DateRangePicker,
  DateRangePickerValue,
  LineChart,
  Callout,
} from "@tremor/react";
import {
  Consultation,
  MetricData,
  Payment,
  Spent,
  Enter,
  Subscription,
  ThemeColor,
} from "../types";
import { useQuery } from "react-query";
import {
  allConsultations,
  allMetrics,
  allPayments,
  allSpents,
  allEnters,
  allSubscriptions,
} from "../api";
import Loader from "@/components/Loader";
import { useAuth } from "@/context";

export default function HomePage() {
  const { data: metricsData, isLoading: metricsLoading } = useQuery<MetricData>(
    "metrics",
    () => allMetrics()
  );

  const { data: consultations, isLoading: consLoading } = useQuery<
    Consultation[]
  >(["consultations"], allConsultations);

  const { data: payments, isLoading: paymentsLoading } = useQuery<Payment[]>(
    ["payments"],
    allPayments
  );
  const { data: spents, isLoading: spentsLoading } = useQuery<Spent[]>(
    ["spents"],
    allSpents
  );
  const { data: enters, isLoading: entersLoading } = useQuery<Enter[]>(
    ["enters"],
    allEnters
  );
  const { data: subscriptions, isLoading: subscriptionsLoading } = useQuery<
    Subscription[]
  >(["subscriptions"], allSubscriptions);

  if (
    metricsLoading ||
    consLoading ||
    paymentsLoading ||
    spentsLoading ||
    entersLoading ||
    subscriptionsLoading
  )
    return <Loader />;

  const { isAdmin } = useAuth();

  if (!isAdmin)
    return (
      <div>
        <Metric>BIENVENU</Metric>
      </div>
    );
  return (
    <div>
      <Grid numCols={1} numColsMd={5} className="gap-5">
        <MetricCard
          label="Revenu total des payements d'abonnement"
          value={`${
            metricsData?.totalSubscriptionPrice.toFixed(2) || 0.0
          } FCFA`}
          color="blue"
        />
        <MetricCard
          label="Revenu total des entrers"
          value={`${
            ((metricsData?.totalProductsBuyedPrice || 0.0) +
            (metricsData?.totalEntersPrice || 0.0)).toFixed(2)
          } FCFA`}
          color="green"
        />
        <MetricCard
          label="Revenu total des examens"
          value={`${metricsData?.totalExamsBuyedPrice.toFixed(2) || 0.0} FCFA`}
          color="fuchsia"
        />
        <MetricCard
          label="Somme totale des dépenses"
          value={`${metricsData?.totalSpentsPrice.toFixed(2) || 0.0} FCFA`}
          color="red"
        />
        <MetricCard
          label="Solde actuel"
          value={`${
            (metricsData?.totalExamsBuyedPrice || 0) +
              (metricsData?.totalProductsBuyedPrice || 0) +
              (metricsData?.totalEntersPrice || 0.0) +
              (metricsData?.totalSubscriptionPrice || 0) -
              (metricsData?.totalSpentsPrice || 0) || 0.0
          } FCFA`}
          color="purple"
        />
      </Grid>
      <Grid numCols={1} numColsMd={2} className="gap-5 mt-10">
        {consultations && (
          <DataChart
            title="Evolution des consultations par mois"
            labelPoint="Nombre de consultations"
            data={consultations}
          />
        )}
        {subscriptions && (
          <DataChart
            title="Evolution des abonnements par mois"
            labelPoint="Nombre d'abonnements"
            data={subscriptions}
          />
        )}
        {payments && (
          <DataChart
            title="Evolution des nombres de ventes(Produits, Examens) par mois"
            labelPoint="Nombre de ventes(Produits, Examens)"
            data={payments}
          />
        )}
        {spents && (
          <DataChart
            title="Evolution des dépenses par mois"
            labelPoint="Nombre de dṕenses"
            data={spents}
          />
        )}
      </Grid>
    </div>
  );
}

type MetricProps = {
  color?: ThemeColor;
  label: string;
  value: string;
};
function MetricCard({ color, label, value }: MetricProps) {
  return (
    <Card className="max-w-xs mx-auto" decoration="top" decorationColor={color}>
      <Text>{label}</Text>
      <Metric color={color}>{value}</Metric>
    </Card>
  );
}

type DataChartProps = {
  title: string;
  data: { created_at?: string }[];
  labelPoint: string;
};
function DataChart({ title, data, labelPoint }: DataChartProps) {
  const [dateInterval, setDateInterval] = useState<DateRangePickerValue>([
    new Date(2023, 1, 1),
    new Date(),
  ]);
  const dataFilteredByDates = useMemo(() => {
    return data.filter((e) => {
      const d = new Date(`${e.created_at}`);
      if (!dateInterval[0] || !dateInterval[1]) return true;
      return d >= dateInterval[0] && d <= dateInterval[1];
    });
  }, [data, dateInterval]);
  const totalsByMonth = useMemo(() => {
    return Object.entries(
      dataFilteredByDates.reduce((acc: any, spent) => {
        const month = new Date(`${spent.created_at}`).toLocaleString(
          "default",
          {
            month: "long",
            year: "numeric",
          }
        );
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {})
    ).map(([key, value]) => {
      let obj: any = {};
      obj["year"] = key;
      obj[labelPoint] = value;
      return obj;
    });
  }, [dataFilteredByDates]);

  return (
    <div className="mt-20">
      <LineChart
        data={totalsByMonth}
        index="year"
        categories={[labelPoint]}
        colors={["orange", "blue"]}
        yAxisWidth={40}
      />

      {totalsByMonth.length <= 0 && (
        <Callout title="Information" color="red">
          Aucune donnée pour cette intervalle de date
        </Callout>
      )}
      <div>
        <Subtitle className="text-center">{title}</Subtitle>
      </div>
      <label>
        <span className="block">Choisissez une intervalle de date</span>
        <DateRangePicker
          className="max-w-[250px]"
          enableDropdown={false}
          maxDate={new Date()}
          value={dateInterval}
          onValueChange={setDateInterval}
        />
      </label>
    </div>
  );
}

const chartdata = [
  {
    year: 1951,
    "Population growth rate": 1.74,
  },
];
