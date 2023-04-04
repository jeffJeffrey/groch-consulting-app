import { Button, SelectBox, SelectBoxItem } from "@tremor/react";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { createSubscription } from "../api";
import { formatDate } from "../functions/dates";
import { Patient } from "../types";

type TypeSubsFormProps = {
  patient: Patient | null;
  onSuccess: () => void;
};
export function NewSubscriptionForm({ patient, onSuccess }: TypeSubsFormProps) {
  const [price, setPrice] = useState<number>();
  const [pack, setPack] = useState(0);
  const subscriptionMutation = useMutation((data) => createSubscription(data), {
    onSuccess,
  });
  async function handleSave(e: any) {
    e.preventDefault();

    const limitDate = formatDate(
      new Date(
        new Date().setMonth(new Date().getMonth() + (pack === 0 ? 1 : 12))
      )
    );
    await subscriptionMutation.mutateAsync({
      price,
      patient_id: patient?.id,
      limitDate,
    } as any);
  }

  useEffect(() => {
    setPrice(defaultPrices[pack]);
  }, [pack]);

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSave}>
      <label>
        <span className="block">Durrée abonnement:</span>
        <SelectBox value={pack + ""} onValueChange={(v) => setPack(+v)}>
          <SelectBoxItem value="0" text="1 mois" />
          <SelectBoxItem value="1" text="12 Mois" />
        </SelectBox>
      </label>
      <label>
        <span className="block">Prix (FCFA):</span>
        <div className="tremor-TextInput-root relative w-full flex items-center min-w-[10rem] focus:outline-none focus:ring-2 bg-white focus:ring-blue-200 border-gray-300 rounded-md border shadow-sm text-gray-700">
          <input
            type="number"
            value={price}
            onChange={({ target }) => setPrice(+target.value)}
            className="tremor-TextInput-input w-full focus:outline-none bg-transparent text-gray-700 pl-4 pr-4 py-2 text-sm font-medium border-0 placeholder:text-gray-500"
          />
        </div>
      </label>
      <Button color="orange">Enrégistrer</Button>
    </form>
  );
}
const defaultPrices = [2000, 5000];
