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
  SelectBox,
  SelectBoxItem,
  Badge,
} from "@tremor/react";
import { IoTrashBinOutline } from "react-icons/io5";
import { Patient } from "../types";
import HeaderPageContent from "../components/HeaderPageContent";
import { useMutation, useQuery } from "react-query";
import { useEffect, useState } from "react";
import {
  allPatients,
  createPatient,
  createSubscription,
  destroyPatient,
  updatePatient,
} from "../api";
import ModaleLayout from "../components/ModaleLayout";
import { formatDate } from "../functions/dates";
import { useNavigate } from "react-router-dom";
import { getValidPackage } from "../functions";
import { NewSubscriptionForm } from "../components/NewSubscriptionForm";

export default function PatientsPage() {
  const navigate = useNavigate();
  const [searchKey, setsearchKey] = useState("");
  const { data: patients, refetch } = useQuery<Patient[]>(
    ["patients"],
    allPatients
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenNewsubsModal, setIsOpenNewsubsModal] = useState(false);
  const [selected, setSelected] = useState<Patient | null>(null);

  const deleteMutation = useMutation((data) => destroyPatient(data), {
    onSuccess: () => refetch(),
  });
  async function deletePatient(id: any) {
    if (window.confirm("Etes vous sure de cette action?"))
      await deleteMutation.mutateAsync(id);
  }

  function handleEditModale(patient: Patient) {
    setSelected(patient);
    setIsOpen(true);
  }
  function handleNewSubscription(p: Patient) {
    setSelected(p);
    setIsOpenNewsubsModal(true);
  }

  return (
    <div>
      <Card>
        <HeaderPageContent
          title="Liste des patients"
          value={searchKey}
          onChange={setsearchKey}
          onAdd={() => setIsOpen(true)}
          buttonLabel=" patient"
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell># ID</TableHeaderCell>
              <TableHeaderCell>Nom</TableHeaderCell>
              <TableHeaderCell>Date de naissance</TableHeaderCell>
              <TableHeaderCell>Adresse</TableHeaderCell>
              <TableHeaderCell>Tel</TableHeaderCell>
              <TableHeaderCell>Date limite d'abonnement</TableHeaderCell>
              <TableHeaderCell>Nouvel abonnement</TableHeaderCell>
              <TableHeaderCell>Consulter</TableHeaderCell>
              <TableHeaderCell>Editer</TableHeaderCell>
              <TableHeaderCell>Supprimer</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!!patients &&
              patients?.map((p, i) => {
                const validPackage = getValidPackage(p);
                return (
                  <TableRow key={i}>
                    <TableCell>#{p.id}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.birthdate?.toString()}</TableCell>
                    <TableCell>{p.address}</TableCell>
                    <TableCell>{p.tel}</TableCell>
                    <TableCell>
                      {validPackage?.limitDate ? (
                        <Badge color="orange">{validPackage?.limitDate}</Badge>
                      ) : (
                        "//"
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleNewSubscription(p)}
                        color="orange"
                        disabled={!!validPackage}
                      >
                        + Abonnement
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          navigate("/consultations/+?user=" + p.id)
                        }
                        color="pink"
                        disabled={!validPackage}
                      >
                        Consulter
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleEditModale(p)}
                        color="purple"
                      >
                        Modifier
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => deletePatient(p.id)}
                        icon={IoTrashBinOutline}
                        color="fuchsia"
                      >
                        Sup
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Card>
      <ModaleLayout
        closeModal={() => {
          setSelected(null);
          setIsOpen(false);
        }}
        isOpen={isOpen}
        title={!selected ? "Nouveau patient" : "Modifier le patient"}
      >
        <PatientForm
          patient={selected}
          onSuccess={() => {
            setSelected(null);
            refetch();
            setIsOpen(false);
          }}
        />
      </ModaleLayout>

      <ModaleLayout
        closeModal={() => {
          setSelected(null);
          setIsOpenNewsubsModal(false);
        }}
        isOpen={isOpenNewsubsModal}
        title={`Nouvel abonnement pour ${selected?.name || ""}`}
      >
        <NewSubscriptionForm
          patient={selected}
          onSuccess={() => {
            setSelected(null);
            refetch();
            setIsOpenNewsubsModal(false);
          }}
        />
      </ModaleLayout>
    </div>
  );
}

type TypePatientFormProps = {
  patient: Patient | null;
  onSuccess: () => void;
};
function PatientForm({ patient, onSuccess }: TypePatientFormProps) {
  const [name, setName] = useState(patient?.name || "");
  const [birthdate, setBirthdate] = useState(patient?.birthdate || undefined);
  const [address, setAddress] = useState(patient?.address || "");
  const [tel, setTel] = useState(patient?.tel || "");
  const spentMutation = useMutation(
    (data) => {
      if (!patient) return createPatient(data);
      return updatePatient(patient.id, data);
    },
    {
      onSuccess,
    }
  );
  async function handleSave(e: any) {
    e.preventDefault();
    await spentMutation.mutateAsync({ name, birthdate, address, tel } as any);
  }
  return (
    <form className="flex flex-col gap-3" onSubmit={handleSave}>
      <label>
        <span className="block">Nom du patient:</span>
        <TextInput
          value={name}
          onChange={({ target }) => setName(target.value)}
          placeholder=""
        />
      </label>
      <label>
        <span className="block">Addresse du patient:</span>
        <TextInput
          value={address}
          onChange={({ target }) => setAddress(target.value)}
          placeholder=""
        />
      </label>
      <label>
        <span className="block">Date de naissance:</span>
        <div className="tremor-TextInput-root relative w-full flex items-center min-w-[10rem] focus:outline-none focus:ring-2 bg-white focus:ring-blue-200 border-gray-300 rounded-md border shadow-sm text-gray-700">
          <input
            type="date"
            value={birthdate?.toString() || undefined}
            onChange={({ target }) => setBirthdate(target.value as any)}
            className="tremor-TextInput-input w-full focus:outline-none bg-transparent text-gray-700 pl-4 pr-4 py-2 text-sm font-medium border-0 placeholder:text-gray-500"
          />
        </div>
      </label>
      <label>
        <span className="block">Telephone:</span>
        <TextInput
          value={tel}
          onChange={({ target }) => setTel(target.value)}
          placeholder=""
        />
      </label>
      <Button>Enrégistrer</Button>
    </form>
  );
}
