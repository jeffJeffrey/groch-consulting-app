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
import { IoEye, IoTrashBinOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { User } from "../types";
import HeaderPageContent from "../components/HeaderPageContent";
import { useState } from "react";
import { allUsers, createUser, destroyUser, updateUser } from "../api";
import { useQuery, useMutation } from "react-query";
import ModaleLayout from "../components/ModaleLayout";
import { isAdmin as userIsAdmin } from "../functions";
import { useAuth } from "../context";

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

type TypeFormProps = {
  user: User | null;
  onSuccess: () => void;
};
function UserForm({ user, onSuccess }: TypeFormProps) {
  const [username, setUsername] = useState(user?.username || "");
  const [name, setName] = useState(user?.name || "");
  const [tel, setTel] = useState(user?.tel || "");
  const [password, setPassword] = useState("");
  const spentMutation = useMutation(
    (data) => {
      if (!user) return createUser(data);
      return updateUser(user.id, data);
    },
    {
      onSuccess,
    }
  );
  async function handleSave(e: any) {
    e.preventDefault();
    await spentMutation.mutateAsync({ name, tel, username, password } as any);
  }
  return (
    <form className="flex flex-col gap-3" onSubmit={handleSave}>
      <label>
        <span className="block">Nom complet:</span>
        <TextInput
          value={name}
          onChange={({ target }) => setName(target.value)}
          placeholder=""
        />
      </label>
      <label>
        <span className="block">Nom d'utilisateur:</span>
        <TextInput
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          placeholder=""
        />
      </label>
      <label>
        <span className="block">Telephone:</span>
        <TextInput
          value={tel}
          onChange={({ target }) => setTel(target.value)}
          placeholder=""
        />
      </label>
      <label>
        <span className="block">Mot de passe:</span>
        <TextInput
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          placeholder=""
        />
      </label>
      <Button>Enrégistrer</Button>
    </form>
  );
}
