import {
  Button,
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TextInput,
} from "@tremor/react";
import { IoIosDocument } from "react-icons/io";
import { IoTrashBinOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Spent } from "../types";
import HeaderPageContent from "../components/HeaderPageContent";
import { useMemo, useState } from "react";
import ModaleLayout from "../components/ModaleLayout";
import { useQuery, useMutation } from "react-query";
import { allSpents, createSpent, destroySpent, updateSpent } from "../api";
import { useAuth } from "../context";
import Loader from "@/components/Loader";

export default function SpentsPage() {
  const [searchKey, setsearchKey] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Spent | null>(null);
  const {
    data: spents,
    refetch,
    isLoading,
  } = useQuery<Spent[]>(["spents"], allSpents);

  function handleEditModale(spent: Spent) {
    setSelected(spent);
    setIsOpen(true);
  }
  const { isAdmin } = useAuth();

  const deleteMutation = useMutation((data) => destroySpent(data), {
    onSuccess: () => refetch(),
  });
  async function deleteSpent(id: any) {
    if (window.confirm("Etes vous sure de cette action?"))
      await deleteMutation.mutateAsync(id);
  }

  const filteredSpents = useMemo(() => {
    let f: Spent[] = [];
    if (searchKey.length === 0 || spents?.length === 0 || !spents)
      return spents || f;
    const lwsk = searchKey.toLowerCase();
    return spents.filter(
      (s) =>
        s.additionalPrice.toString().includes(lwsk) ||
        s.motif.includes(searchKey.toLowerCase()) ||
        s.id.toString().includes(lwsk) ||
        s.price.toString().includes(lwsk)
    );
  }, [searchKey, spents]);
  if (!isAdmin) return <></>;
  if (isLoading) return <Loader />;
  return (
    <div>
      <Card>
        <HeaderPageContent
          title="Liste des des dépenses"
          value={searchKey}
          onChange={setsearchKey}
          onAdd={() => setIsOpen(true)}
          buttonLabel="Nouvelle dépense"
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell># ID</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Motif</TableHeaderCell>
              <TableHeaderCell>Prix</TableHeaderCell>
              <TableHeaderCell>Prix supplementaire</TableHeaderCell>
              <TableHeaderCell>Modifier</TableHeaderCell>
              <TableHeaderCell>Supprimer</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSpents.map((p, i) => (
              <TableRow key={i}>
                <TableCell>#{p.id}</TableCell>
                <TableCell>23/02/2023</TableCell>
                <TableCell>{p.motif}</TableCell>
                <TableCell>{p.price}</TableCell>
                <TableCell>{p.additionalPrice}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEditModale(p)} color="purple">
                    Modif
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => deleteSpent(p.id)}
                    icon={IoTrashBinOutline}
                    color="fuchsia"
                  >
                    Sup
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <ModaleLayout
        closeModal={() => {
          setSelected(null);
          setIsOpen(false);
        }}
        isOpen={isOpen}
        title={!selected ? "Nouvelle dépense" : "Modifier la dépense"}
      >
        <SpentForm
          spent={selected}
          onSuccess={() => {
            setSelected(null);
            refetch();
            setIsOpen(false);
          }}
        />
      </ModaleLayout>
    </div>
  );
}

type SpentFormPorps = {
  onSuccess: () => void;
  spent: Spent | null;
};

function SpentForm({ onSuccess, spent }: SpentFormPorps) {
  const [motif, setMotif] = useState(spent?.motif || "");
  const [price, setPrice] = useState(spent?.price || 0);
  const [additionalPrice, setAdditionalPrice] = useState(
    spent?.additionalPrice || 0
  );
  const spentMutation = useMutation(
    (data) => {
      if (!spent) return createSpent(data);
      return updateSpent(spent.id, data);
    },
    {
      onSuccess,
    }
  );
  async function handleSave(e: any) {
    e.preventDefault();
    await spentMutation.mutateAsync({ price, additionalPrice, motif } as any);
  }
  return (
    <form className="flex flex-col gap-3" onSubmit={handleSave}>
      <label>
        <span className="block">Motif:</span>
        <TextInput
          value={motif}
          onChange={({ target }) => setMotif(target.value)}
          placeholder="Motif"
        />
      </label>
      <label>
        <span className="block">Somme principale dépensée:</span>
        <div className="tremor-TextInput-root relative w-full flex items-center min-w-[10rem] focus:outline-none focus:ring-2 bg-white focus:ring-blue-200 border-gray-300 rounded-md border shadow-sm text-gray-700">
          <input
            type="number"
            value={price}
            onChange={({ target }) => setPrice(+target.value)}
            className="tremor-TextInput-input w-full focus:outline-none bg-transparent text-gray-700 pl-4 pr-4 py-2 text-sm font-medium border-0 placeholder:text-gray-500"
          />
        </div>
      </label>
      <label>
        <span className="block">Somme dépenses additionnelle:</span>
        <div className="tremor-TextInput-root relative w-full flex items-center min-w-[10rem] focus:outline-none focus:ring-2 bg-white focus:ring-blue-200 border-gray-300 rounded-md border shadow-sm text-gray-700">
          <input
            type="number"
            min={0}
            value={additionalPrice}
            onChange={({ target }) => setAdditionalPrice(+target.value)}
            className="tremor-TextInput-input w-full focus:outline-none bg-transparent text-gray-700 pl-4 pr-4 py-2 text-sm font-medium border-0 placeholder:text-gray-500"
          />
        </div>
      </label>
      <Button loading={spentMutation.isLoading} type="submit">
        Enregistrer
      </Button>
    </form>
  );
}
