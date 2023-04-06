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
import { User } from "../types";
import HeaderPageContent from "../components/HeaderPageContent";
import { useState } from "react";
import { allUsers, createUser, destroyUser, updateUser } from "../api";
import { useQuery, useMutation } from "react-query";
import ModaleLayout from "../components/ModaleLayout";
import { isAdmin as userIsAdmin } from "../functions";
import { useAuth } from "../context";
import { UserForm } from "@/components/UserForm";
import Loader from "@/components/Loader";

export default function UsersPage() {
  const [searchKey, setsearchKey] = useState("");
  const {
    isLoading,
    data: users,
    refetch,
  } = useQuery<User[]>(["users"], allUsers);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);

  const deleteMutation = useMutation((data) => destroyUser(data), {
    onSuccess: () => refetch(),
  });
  async function deleteUser(id: any) {
    if (window.confirm("Etes vous sure de cette action?"))
      await deleteMutation.mutateAsync(id);
  }

  function handleEditModale(user: User) {
    setSelected(user);
    setIsOpen(true);
  }
  const { isAdmin } = useAuth();
  if (isLoading) return <Loader />;

  return (
    <div>
      <Card>
        <HeaderPageContent
          title="Liste des utilisateurs"
          value={searchKey}
          onChange={setsearchKey}
          onAdd={() => setIsOpen(true)}
          buttonLabel="Nouvel utilisateur"
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell># ID</TableHeaderCell>
              <TableHeaderCell>Nom</TableHeaderCell>
              <TableHeaderCell>Nom d'utilisateur</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Modifier</TableHeaderCell>
              {isAdmin && <TableHeaderCell>Supprimer</TableHeaderCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {!!users &&
              users?.map((p, i) => (
                <TableRow key={i}>
                  <TableCell>#{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.username}</TableCell>
                  <TableCell>
                    {userIsAdmin(p) ? (
                      <Badge color="orange">Administrateur</Badge>
                    ) : (
                      <Badge>Utilisateur</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditModale(p)} color="pink">
                      Modif
                    </Button>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <Button
                        color="fuchsia"
                        onClick={() => deleteUser(p.id)}
                        icon={IoTrashBinOutline}
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
      <ModaleLayout
        closeModal={() => {
          setSelected(null);
          setIsOpen(false);
        }}
        isOpen={isOpen}
        title={!selected ? "Nouvel utilisateur" : "Modifier l'utilisateur"}
      >
        <UserForm
          user={selected}
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
