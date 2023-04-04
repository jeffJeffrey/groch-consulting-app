import {
  Grid,
  Col,
  Metric,
  TextInput,
  Text,
  Button,
  Flex,
  Card,
  Callout,
} from "@tremor/react";
import { UserIcon, KeyIcon, ExclamationIcon } from "@heroicons/react/solid";
import PharmacyCall from "../assets/images/pharmacist-will-call-medical-animation.gif";
import { useState } from "react";
import { useMutation } from "react-query";
import { login } from "../api";
import { User } from "../types";
import { useLocalStorage } from "usehooks-ts";

export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useLocalStorage<string | null>("token", null);
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const loginMutation = useMutation<
    { token: string; user: User },
    any,
    { username: string; password: string }
  >((data) => login(data), {
    onSuccess: (data: any) => {
      setToken(data.token);
      setUser(data.user);
    },
    onError: (error) => {
      if (!!error.status && error.status == 401)
        return setError("Identifiants incorrectes!");
      return setError(
        "Une érreur est survenu, veillez vérrifier votre accès au réseau"
      );
    },
  });
  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");
    await loginMutation.mutateAsync({ username, password });
  }
  return (
    <Grid numCols={1} numColsMd={2}>
      <Col>
        <Flex
          justifyContent="center"
          alignItems="center"
          className="min-h-screen bg-white"
        >
          <div>
            <Card>
              <Metric>Se connecter</Metric>
              {error.length > 0 && (
                <Callout icon={ExclamationIcon} title="Erreur" color="red">
                  {error}
                </Callout>
              )}
              <form
                onSubmit={handleSubmit}
                className="flex-col mt-3 gap-4 flex"
              >
                <label htmlFor="userName">
                  <Text>Nom d'utilisateur:</Text>
                  <TextInput
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                    placeholder=""
                    id="userName"
                    icon={UserIcon}
                  />
                </label>
                <label htmlFor="userName">
                  <Text>Mot de passe:</Text>
                  <div className="tremor-TextInput-root relative w-full flex items-center min-w-[10rem] focus:outline-none focus:ring-2 bg-white focus:ring-blue-200 border-gray-300 rounded-md border shadow-sm text-gray-700">
                    <input
                      type="password"
                      value={password}
                      onChange={({ target }) => setPassword(target.value)}
                      className="tremor-TextInput-input w-full focus:outline-none bg-transparent text-gray-700 pl-4 pr-4 py-2 text-sm font-medium border-0 placeholder:text-gray-500"
                    />
                  </div>
                </label>
                <Button
                  loading={loginMutation.isLoading}
                  disabled={username.length <= 0 || password.length <= 0}
                  type="submit"
                >
                  Se connecter
                </Button>
              </form>
            </Card>
          </div>
        </Flex>
      </Col>
      <Col className="hidden md:block">
        <Flex
          justifyContent="center"
          alignItems="center"
          className="min-h-screen bg-white"
        >
          <img src={PharmacyCall} />
        </Flex>
      </Col>
    </Grid>
  );
}
