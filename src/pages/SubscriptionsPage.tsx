import {
  Button,
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "@tremor/react";
import { IoTrashBinOutline } from "react-icons/io5";
import { Subscription } from "../types";
import HeaderPageContent from "../components/HeaderPageContent";
import { useState } from "react";
import { allSubscriptions, destroySubscription } from "../api";
import { useMutation, useQuery } from "react-query";
import { formatDate, strToDate } from "../functions/dates";
import { useAuth } from "../context";
import Loader from "@/components/Loader";

export default function SubscriptionsPage() {
  const [searchKey, setsearchKey] = useState("");
  const {
    data: subscriptions,
    refetch,
    isLoading,
  } = useQuery<Subscription[]>(["subscriptions"], allSubscriptions);

  const deleteMutation = useMutation((data) => destroySubscription(data), {
    onSuccess: () => refetch(),
  });
  async function deleteExam(id: any) {
    if (window.confirm("Etes vous sure de cette action?"))
      await deleteMutation.mutateAsync(id);
  }

  const { isAdmin } = useAuth();
  if (isLoading) return <Loader />;

  return (
    <div>
      <Card>
        <HeaderPageContent
          title="Liste des abonnements"
          value={searchKey}
          onChange={setsearchKey}
          buttonLabel="Nouvel abonnement"
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell># ID</TableHeaderCell>
              <TableHeaderCell>Patient</TableHeaderCell>
              <TableHeaderCell>Date de souscrition</TableHeaderCell>
              <TableHeaderCell>Date limite</TableHeaderCell>
              <TableHeaderCell>Prix (FCFA)</TableHeaderCell>
              {isAdmin && <TableHeaderCell>Supprimer</TableHeaderCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {subscriptions?.map((p, i) => (
              <TableRow key={i}>
                <TableCell>#{p.id}</TableCell>
                <TableCell>{p.patient?.name}</TableCell>
                <TableCell>{formatDate(new Date(`${p.created_at}`))}</TableCell>
                <TableCell>{formatDate(strToDate(p.limitDate))}</TableCell>
                <TableCell>{p.price}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <Button
                      onClick={() => deleteExam(p.id)}
                      icon={IoTrashBinOutline}
                      color="fuchsia"
                    >
                      Sup
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
