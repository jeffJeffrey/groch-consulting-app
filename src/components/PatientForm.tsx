import { TextInput, Grid, Button } from "@tremor/react";
import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPatient, updatePatient } from "../api";
import { Patient } from "../types";

export function PatientForm({
  onEditSuccess,
  patient,
}: {
  patient?: Patient;
  onEditSuccess: () => void;
}) {
  const [name, setName] = useState(patient?.name || "");
  const [birthdate, setBirthdate] = useState(patient?.birthdate || undefined);
  const [address, setAddress] = useState(patient?.address || "");
  const [tel, setTel] = useState(patient?.tel || "");
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    if (!!patient) {
      setName(patient.name);
      setBirthdate(patient.birthdate);
      setAddress(patient.address);
      setTel(patient.tel);
      onEditSuccess();
    }
  }, [patient]);
  const patientMutation = useMutation(
    (data) => {
      if (!patient) return createPatient(data);
      return updatePatient(patient.id, data);
    },
    {
      onSuccess: (data) => {
        if (!params.get("user"))
          navigate(
            "/consultations/+?" +
              new URLSearchParams({ ...params, user: data.id })
          );
      },
    }
  );

  async function handleSave(e: any) {
    e.preventDefault();
    await patientMutation.mutateAsync({ name, birthdate, address, tel } as any);
  }
  return (
    <form className="flex flex-col gap-3" onSubmit={handleSave}>
      <label>
        <span className="block">Nom:</span>
        <TextInput
          value={name}
          onChange={({ target }) => setName(target.value)}
          placeholder=""
        />
      </label>
      <Grid numCols={1} numColsMd={2} className="gap-3">
        <label>
          <span className="block">Addresse:</span>
          <TextInput
            value={address}
            onChange={({ target }) => setAddress(target.value)}
            placeholder=""
          />
        </label>
        <label>
          <span className="block">Date de naissance:</span>
          <input
            type="date"
            value={birthdate?.toString() || undefined}
            onChange={({ target }) => setBirthdate(target.value as any)}
            className="bg-white border block min-h-[auto] w-full rounded bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
            placeholder="Default input"
          />
        </label>
      </Grid>
      <label>
        <span>Tel:</span>
        <TextInput
          value={tel}
          onChange={({ target }) => setTel(target.value)}
          placeholder=""
          inputMode="tel"
        />
      </label>
      <Button color="orange" loading={patientMutation.isLoading}>
        Sauvegarder
      </Button>
    </form>
  );
}
