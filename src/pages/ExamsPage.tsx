import {
  Button,
  TextInput,
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "@tremor/react";
import { IoTrashBinOutline } from "react-icons/io5";
import { Exam } from "../types";
import HeaderPageContent from "../components/HeaderPageContent";
import { useState } from "react";
import { allExams, createExam, destroyExam, updateExam } from "../api";
import { useMutation, useQuery } from "react-query";
import ModaleLayout from "../components/ModaleLayout";
import { useAuth } from "../context";

export default function ExamnsPage() {
  const [searchKey, setsearchKey] = useState("");
  const { data: exams, refetch } = useQuery<Exam[]>(["exams"], allExams);

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Exam | null>(null);
  const { isAdmin } = useAuth();
  const deleteMutation = useMutation((data) => destroyExam(data), {
    onSuccess: () => refetch(),
  });
  async function deleteExam(id: any) {
    if (window.confirm("Etes vous sure de cette action?"))
      await deleteMutation.mutateAsync(id);
  }

  function handleEditModale(type: Exam) {
    setSelected(type);
    setIsOpen(true);
  }
  return (
    <div>
      <Card>
        <HeaderPageContent
          title="Liste des examens"
          value={searchKey}
          onChange={setsearchKey}
          onAdd={isAdmin ? () => setIsOpen(true) : undefined}
          buttonLabel="Nouvel examen"
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell># ID</TableHeaderCell>
              <TableHeaderCell>Libelle</TableHeaderCell>
              <TableHeaderCell>Prix</TableHeaderCell>
              <TableHeaderCell>Total éffectués</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              {isAdmin && (
                <>
                  <TableHeaderCell>Modifier</TableHeaderCell>
                  <TableHeaderCell>Supprimer</TableHeaderCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {exams?.map((p, i) => (
              <TableRow key={i}>
                <TableCell>#{p.id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.price} FCFA</TableCell>
                <TableCell>{p.appliedCount}</TableCell>
                <TableCell>{p.description}</TableCell>
                {isAdmin && (
                  <>
                    <TableCell>
                      <Button
                        onClick={() => handleEditModale(p)}
                        color="purple"
                      >
                        Modif
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => deleteExam(p.id)}
                        icon={IoTrashBinOutline}
                        color="fuchsia"
                      >
                        Sup
                      </Button>
                    </TableCell>
                  </>
                )}
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
        title={!selected ? "Nouvelle examen" : "Modifier l'examen"}
      >
        <ExamForm
          exam={selected}
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

type TypeFormProps = {
  exam: Exam | null;
  onSuccess: () => void;
};
function ExamForm({ exam, onSuccess }: TypeFormProps) {
  const [name, setName] = useState(exam?.name || "");
  const [description, setDescription] = useState(exam?.description || "");
  const [price, setPrice] = useState(exam?.price || 0);
  const spentMutation = useMutation(
    (data) => {
      if (!exam) return createExam(data);
      return updateExam(exam.id, data);
    },
    {
      onSuccess,
    }
  );
  async function handleSave(e: any) {
    e.preventDefault();
    await spentMutation.mutateAsync({ name, description, price } as any);
  }
  return (
    <form className="flex flex-col gap-3" onSubmit={handleSave}>
      <label>
        <span className="block">Nom del'examen:</span>
        <TextInput
          value={name}
          onChange={({ target }) => setName(target.value)}
          placeholder="Ex: verres médicaux, Médicamant"
        />
      </label>
      <label>
        <span className="block">Prix de l'examen:</span>
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
        <span className="block">Description:</span>
        <TextInput
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          placeholder=""
        />
      </label>
      <Button loading={spentMutation.isLoading}>Enrégistrer</Button>
    </form>
  );
}
