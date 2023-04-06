import {
  Button,
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  TextInput,
} from "@tremor/react";
import { IoTrashBinOutline } from "react-icons/io5";
import { Diagnostic, User } from "../types";
import HeaderPageContent from "../components/HeaderPageContent";
import { useState } from "react";
import { useQuery, useMutation } from "react-query";
import {
  allDiagnostics,
  createDiagnostic,
  destroyType,
  updateDiagnostic,
} from "../api";
import ModaleLayout from "../components/ModaleLayout";

export default function DiagnosticsPage() {
  const {
    isLoading,
    data: types,
    refetch,
  } = useQuery<Diagnostic[]>(["diagnostics"], allDiagnostics);

  const [searchKey, setsearchKey] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Diagnostic | null>(null);

  const deleteMutation = useMutation((data) => destroyType(data), {
    onSuccess: () => refetch(),
  });
  async function deleteType(id: any) {
    if (window.confirm("Etes vous sure de cette action?"))
      await deleteMutation.mutateAsync(id);
  }

  function handleEditModale(type: Diagnostic) {
    setSelected(type);
    setIsOpen(true);
  }
  return (
    <div>
      <Card>
        <HeaderPageContent
          title="Liste des diagnostics"
          value={searchKey}
          onChange={setsearchKey}
          onAdd={() => setIsOpen(true)}
          buttonLabel="Nouveau diagnostique"
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell># ID</TableHeaderCell>
              <TableHeaderCell>Intitullé</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>Nombre d'utilisations</TableHeaderCell>
              <TableHeaderCell>Modifier</TableHeaderCell>
              <TableHeaderCell>Supprimer</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {types?.map((p, i) => (
              <TableRow key={i}>
                <TableCell>#{p.id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.description}</TableCell>
                <TableCell>{p.consultations?.length || 0}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEditModale(p)} color="pink">
                    Modif
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    color="fuchsia"
                    onClick={() => deleteType(p.id)}
                    disabled={p.consultations && p.consultations?.length > 0}
                    icon={IoTrashBinOutline}
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
        title={!selected ? "Nouveau diagnostique" : "Modifier le diagnostique"}
      >
        <TypeForm
          type={selected}
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
  type: Diagnostic | null;
  onSuccess: () => void;
};
function TypeForm({ type, onSuccess }: TypeFormProps) {
  const [name, setName] = useState(type?.name || "");
  const [description, setDescription] = useState(type?.description || "");
  const spentMutation = useMutation(
    (data) => {
      if (!type) return createDiagnostic(data);
      return updateDiagnostic(type.id, data);
    },
    {
      onSuccess,
    }
  );
  async function handleSave(e: any) {
    e.preventDefault();
    await spentMutation.mutateAsync({ name, description } as any);
  }
  return (
    <form className="flex flex-col gap-3" onSubmit={handleSave}>
      <label>
        <span className="block">Intitullé du diagnostic:</span>
        <TextInput
          value={name}
          onChange={({ target }) => setName(target.value)}
          placeholder="Ex: verres médicaux, Médicamant"
        />
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
