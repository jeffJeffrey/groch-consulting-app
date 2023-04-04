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
} from "@tremor/react";
import { IoEye, IoTrashBinOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Consultation } from "../types";
import HeaderPageContent from "../components/HeaderPageContent";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { allConsultations, destroyConsultation } from "../api";
import { formatDate } from "../functions/dates";

export default function ConsultationsPage() {
  const [searchKey, setsearchKey] = useState("");
  const navigate = useNavigate();
  const {
    isLoading,
    data: consultations,
    refetch,
  } = useQuery<Consultation[]>(["consultations"], allConsultations);

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Consultation | null>(null);

  const deleteMutation = useMutation((data) => destroyConsultation(data), {
    onSuccess: () => refetch(),
  });
  async function deleteConsultation(id: any) {
    if (window.confirm("Etes vous sure de cette action?"))
      await deleteMutation.mutateAsync(id);
  }

  function handleEditModale(type: Consultation) {
    setSelected(type);
    setIsOpen(true);
  }
  return (
    <div>
      <Card>
        <HeaderPageContent
          title="Liste des consulttions"
          value={searchKey}
          onChange={setsearchKey}
          onAdd={() => navigate({ pathname: "/consultations/+" })}
          buttonLabel="Nouvelle consultation"
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell># ID</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Patient</TableHeaderCell>
              <TableHeaderCell>Consulté par</TableHeaderCell>
              <TableHeaderCell>Diagnostic</TableHeaderCell>
              <TableHeaderCell>Voir</TableHeaderCell>
              <TableHeaderCell>Supprimer</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consultations?.map((p, i) => (
              <TableRow key={i}>
                <TableCell>#{p.id}</TableCell>
                <TableCell>{formatDate(new Date(p.created_at + ""))}</TableCell>
                <TableCell>{p.patient?.name}</TableCell>
                <TableCell>{p.user?.name}</TableCell>
                <TableCell>
                  <Badge color="orange">{p.diagnostic?.name}</Badge>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() =>
                      navigate(
                        `/consultations/+?user=${p.patient?.id}&cons=${p.id}`
                      )
                    }
                    icon={IoEye}
                  >
                    Voir
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => deleteConsultation(p.id)}
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
        <div className="flex justify-center">
          <nav aria-label="Page navigation example">
            <ul className="list-style-none flex">
              <li>
                <Link
                  to="#"
                  className="pointer-events-none relative block rounded bg-transparent py-1.5 px-3 text-sm text-neutral-500 transition-all duration-300 dark:text-neutral-400"
                >
                  Previous
                </Link>
              </li>
              <li>
                <Link
                  className="relative block rounded bg-transparent py-1.5 px-3 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100  dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
                  to="#!"
                >
                  1
                </Link>
              </li>
              <li aria-current="page">
                <Link
                  className="relative block rounded bg-primary-100 py-1.5 px-3 text-sm font-medium text-primary-700 transition-all duration-300"
                  to="#!"
                >
                  2
                  <span className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
                    (current)
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  className="relative block rounded bg-transparent py-1.5 px-3 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
                  to="#!"
                >
                  3
                </Link>
              </li>
              <li>
                <Link
                  className="relative block rounded bg-transparent py-1.5 px-3 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
                  to="#!"
                >
                  Next
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </Card>
    </div>
  );
}
