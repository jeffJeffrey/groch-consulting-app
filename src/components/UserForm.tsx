import { createUser, updateUser } from "@/api";
import { User } from "@/types";
import { TextInput, Button } from "@tremor/react";
import { useState } from "react";
import { useMutation } from "react-query";

type TypeFormProps = {
  user: User | null;
  onSuccess: () => void;
};
export function UserForm({ user, onSuccess }: TypeFormProps) {
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
    await spentMutation.mutateAsync({
      name,
      tel,
      username,
      password: password.length > 0 ? password : undefined,
    } as any);
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
        <small>
          Le nom d'utilisateur doit etre unique pour chaque utilisateur!
        </small>
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
      <Button loading={spentMutation.isLoading}>Enrégistrer</Button>
    </form>
  );
}
