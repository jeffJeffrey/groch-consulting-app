import {
  Col,
  Grid,
  Card,
  Title,
  Button,
  Toggle,
  Subtitle,
  TextInput,
  SelectBox,
  ToggleItem,
  SelectBoxItem,
  MultiSelectBox,
  MultiSelectBoxItem,
  Callout,
} from "@tremor/react";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  allDiagnostics,
  allExams,
  createConsultation,
  retrieveConsultation,
  retrievePatient,
  setConsultationAsBilled,
  updateConsultation,
} from "../api";
import {
  Consultation,
  Diagnostic,
  Exam,
  EyeglassesData,
  Patient,
} from "../types";
import { getValidPackage } from "../functions";
import ModaleLayout from "../components/ModaleLayout";
import { NewSubscriptionForm } from "../components/NewSubscriptionForm";
import { PatientForm } from "../components/PatientForm";
import { useAuth } from "../context";
import { PrescriptionForm } from "../components/PrescriptionForm";
import { IoLogoEuro } from "react-icons/io5";
import BillModal from "../components/BillModal";

export default function NewConsultationPage() {
  const [params] = useSearchParams();
  let patientId = params.get("user");
  let consulationId = params.get("cons");

  const { data: patient, refetch } = useQuery<any, Error, Patient>(
    ["patients", patientId],
    () => retrievePatient(patientId),
    { enabled: !!patientId }
  );

  const { data: consultation, refetch: refetchCons } = useQuery<
    any,
    Error,
    Consultation
  >(
    ["consultations", consulationId],
    () => retrieveConsultation(consulationId),
    {
      enabled: !!consulationId,
    }
  );

  const [isOpenNewsubsModal, setIsOpenNewsubsModal] = useState(false);

  const totalPrice = useMemo(() => {
    let ep = 0;
    consultation?.exams?.forEach((e) => {
      ep += e.price;
    });
    let prescTotal = 0;
    if (!!consultation && consultation.prescriptions) {
      consultation.prescriptions.forEach((pres) => {
        if (pres.eyeglasses && (pres.eyeglasses?.length || 0) > 2) {
          prescTotal +=
            (JSON.parse(pres.eyeglasses) as EyeglassesData).price || 0;
        } else {
          prescTotal += (pres.product?.price || 0) * (pres.quantity || 1);
        }
      });
    }
    return prescTotal + ep;
  }, [consultation?.prescriptions, consultation?.exams]);

  const billedMutation = useMutation((q: any) =>
    setConsultationAsBilled(consultation?.id)
  );

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <Title className="mb-3">Informations du patient</Title>
        <PatientForm patient={patient} onEditSuccess={() => refetch()} />
      </Card>
      {!!(patient && !!getValidPackage(patient)) && (
        <Card>
          <Title className="mb-3">Edition d'une consultation</Title>
          {consultation?.billed && (
            <Callout title="Note">
              Cette consultation a déja été facturé donc ne faites plus les
              modification qui vont impacter le prix, sinon elle ne sera pas
              prise en compte.
            </Callout>
          )}
          <ConsultationForm patient={patient} data={consultation} />
          {!!consultation && (
            <>
              <PrescriptionForm
                consultation={consultation}
                onSuccess={() => refetchCons()}
              />
              <BillModal
                consultation={consultation}
                onSuccess={() => {
                  billedMutation.mutateAsync(undefined);
                  refetchCons();
                }}
              />
            </>
          )}
        </Card>
      )}
      {!!patient && !getValidPackage(patient) && (
        <div>
          <Callout color="orange" title="Information!">
            Ce patient n'a pas d'abonnement valide
          </Callout>
          <Button
            onClick={() => setIsOpenNewsubsModal(true)}
            color="orange"
            className="mt-3"
          >
            Nouvel abonnement pour {patient?.name}
          </Button>

          <ModaleLayout
            closeModal={() => {
              setIsOpenNewsubsModal(false);
            }}
            isOpen={isOpenNewsubsModal}
            title={`Nouvel abonnement pour ${patient.name || ""}`}
          >
            <NewSubscriptionForm
              patient={patient}
              onSuccess={() => {
                refetch();
                setIsOpenNewsubsModal(false);
              }}
            />
          </ModaleLayout>
        </div>
      )}
    </div>
  );
}

function ConsultationForm({
  data,
  patient,
}: {
  data?: Consultation;
  patient: Patient;
}) {
  const { data: diagnostics } = useQuery<Diagnostic[]>(
    ["diagnostics"],
    allDiagnostics
  );

  const [consData, setConsData] = useState<Consultation>(
    data
      ? data
      : {
          leftEye: "",
          rightEye: "",
          motif: "",
          medicaux: "",
          chirugicaux: "",
          immunologique: "",
          gpao: true,
          traumatisme: true,
          vc: true,
          paupieres: "",
          iris: "",
          cristallin: "",
          conjonctive: "",
          pupille: "",
          sclere: "",
          cornee: "",
          vitree: "",
          retine: "",
          macula: "",
          vaisseau: "",

          id: "1",
        }
  );
  const { data: exams } = useQuery<Exam[]>(["exams"], allExams);

  const [diagnostic_id, setDiagnostic_id] = useState<
    number | string | undefined
  >(data && data.diagnostic?.id);

  useEffect(() => {
    if (!!data?.id) {
      setConsData(data);
      setDiagnostic_id(data.diagnostic?.id);
    }
  }, [data]);

  const [selectedExams, setSelectedExams] = useState<(string | number)[]>([]);

  useEffect(() => {
    if (!!consData.exams) setSelectedExams(consData.exams.map((e) => e.id));
  }, [consData]);

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const consMutation = useMutation(
    (q: any) => {
      if (!data) return createConsultation({ ...q, diagnostic_id });
      return updateConsultation(data.id, { ...q, diagnostic_id });
    },
    {
      onSuccess: (resp) => {
        if (!params.get("cons"))
          navigate(`/consultations/+?user=${resp.patient.id}&cons=${resp.id}`);
      },
    }
  );

  const { user } = useAuth();

  async function handleSave(e: any) {
    e.preventDefault();
    await consMutation.mutateAsync({
      ...consData,
      patient_id: patient.id,
      exams: selectedExams,
      user_id: user?.id,
    } as any);
  }
  return (
    <form className="flex flex-col gap-3" onSubmit={handleSave}>
      <Subtitle>Acuité visuel</Subtitle>
      <Grid numCols={1} numColsMd={2} className="gap-3">
        <label>
          <span className="block">Oeuil droit:</span>
          <TextInput
            value={consData.rightEye}
            onChange={({ target }) =>
              setConsData((v) => ({ ...v, rightEye: target.value }))
            }
            placeholder="Ex: 6/10"
          />
        </label>
        <label>
          <span className="block">Oeuil gauche:</span>
          <TextInput
            value={consData.leftEye}
            onChange={({ target }) =>
              setConsData((v) => ({ ...v, leftEye: target.value }))
            }
            placeholder="Ex: 7/10"
          />
        </label>
      </Grid>
      <label className="block">
        <span>Motif de la consultation:</span>
        <div className="tremor-TextInput-root relative w-full flex items-center min-w-[10rem] focus:outline-none focus:ring-2 bg-white focus:ring-blue-200 border-gray-300 rounded-md border shadow-sm text-gray-700">
          <textarea
            value={consData.motif}
            onChange={({ target }) =>
              setConsData((v) => ({ ...v, motif: target.value }))
            }
            className="tremor-TextInput-input w-full focus:outline-none bg-transparent text-gray-700 pl-4 pr-4 py-2 text-sm font-medium border-0 placeholder:text-gray-500"
            name=""
            id=""
            rows={5}
          ></textarea>
        </div>
      </label>
      <Grid numCols={1} numColsMd={2} className="mt-3 gap-3">
        <Col className="flex flex-col gap-3">
          <Subtitle>Entécédents Généraux</Subtitle>
          <label>
            <span className="block">Médcaux:</span>
            <TextInput
              value={consData.medicaux}
              onChange={({ target }) =>
                setConsData((v) => ({ ...v, medicaux: target.value }))
              }
              placeholder=""
            />
          </label>
          <label>
            <span className="block">Chirurgicaux:</span>
            <TextInput
              value={consData.chirugicaux}
              onChange={({ target }) =>
                setConsData((v) => ({ ...v, chirugicaux: target.value }))
              }
              placeholder=""
            />
          </label>
          <label>
            <span className="block">Immunologique:</span>
            <TextInput
              value={consData.immunologique}
              onChange={({ target }) =>
                setConsData((v) => ({ ...v, immunologique: target.value }))
              }
              placeholder=""
            />
          </label>
        </Col>
        <Col className="flex flex-col gap-3">
          <Subtitle>Entécédents Ophtalmologiques</Subtitle>
          <label>
            <span className="block">GPAO:</span>
            <Toggle
              color="orange"
              value={consData.gpao ? "1" : "0"}
              onValueChange={(value) =>
                setConsData((v) => ({ ...v, gpao: value != "0" }))
              }
              defaultValue="0"
            >
              <ToggleItem value="0" text="Non" />
              <ToggleItem value="1" text="Oui" />
            </Toggle>
          </label>
          <label>
            <span className="block">VC:</span>
            <Toggle
              color="orange"
              value={consData.vc ? "1" : "0"}
              onValueChange={(value) =>
                setConsData((v) => ({ ...v, vc: value != "0" }))
              }
              defaultValue="0"
            >
              <ToggleItem value="0" text="Non" />
              <ToggleItem value="1" text="Oui" />
            </Toggle>
          </label>
          <label>
            <span className="block">Traumatisme:</span>
            <Toggle
              color="orange"
              value={consData.traumatisme ? "1" : "0"}
              onValueChange={(value) =>
                setConsData((v) => ({ ...v, traumatisme: value != "0" }))
              }
              defaultValue="0"
            >
              <ToggleItem value="0" text="Non" />
              <ToggleItem value="1" text="Oui" />
            </Toggle>
          </label>
        </Col>
      </Grid>
      <Grid numCols={1} numColsMd={2} className="mt-3 gap-3">
        <Col className="flex flex-col gap-3">
          <Subtitle>Lampe a fente</Subtitle>
          <label>
            <span className="block">Paupieres:</span>
            <TextInput
              value={consData.paupieres}
              onChange={({ target }) =>
                setConsData((v) => ({ ...v, paupieres: target.value }))
              }
              placeholder=""
            />
          </label>
          <label>
            <span className="block">Iris:</span>
            <TextInput
              value={consData.iris}
              onChange={({ target }) =>
                setConsData((v) => ({ ...v, iris: target.value }))
              }
              placeholder=""
            />
          </label>
          <label>
            <span className="block">Cristallin:</span>
            <TextInput
              value={consData.cristallin}
              onChange={({ target }) =>
                setConsData((v) => ({ ...v, cristallin: target.value }))
              }
              placeholder=""
            />
          </label>
          <label>
            <span className="block">Conjonctive:</span>
            <TextInput
              value={consData.conjonctive}
              onChange={({ target }) =>
                setConsData((v) => ({ ...v, conjonctive: target.value }))
              }
              placeholder=""
            />
          </label>
        </Col>
        <Col className="flex flex-col gap-3 md:mt-9">
          <label>
            <span className="block">Pupille:</span>
            <TextInput
              value={consData.pupille}
              onChange={({ target }) =>
                setConsData((v) => ({ ...v, pupille: target.value }))
              }
              placeholder=""
            />
          </label>
          <label>
            <span className="block">Cornée:</span>
            <TextInput
              value={consData.cornee}
              onChange={({ target }) =>
                setConsData((v) => ({ ...v, cornee: target.value }))
              }
              placeholder=""
            />
          </label>
          <label>
            <span className="block">Sclere:</span>
            <TextInput
              value={consData.sclere}
              onChange={({ target }) =>
                setConsData((v) => ({ ...v, sclere: target.value }))
              }
              placeholder=""
            />
          </label>
        </Col>
      </Grid>

      <Grid numCols={1} numColsMd={2} className="mt-3 gap-3">
        <Col className="flex flex-col gap-3">
          <Subtitle>Fond d'oeuil</Subtitle>
          <label>
            <span className="block">Vitrée:</span>
            <SelectBox
              value={consData.vitree}
              onValueChange={(value) =>
                setConsData((v) => ({ ...v, vitree: value }))
              }
              defaultValue="0"
            >
              <SelectBoxItem value="Transparent" />
              <SelectBoxItem value="Floue" />
            </SelectBox>
          </label>
          <label>
            <span className="block">Rétine:</span>
            <SelectBox
              value={consData.retine}
              onValueChange={(value) =>
                setConsData((v) => ({ ...v, retine: value }))
              }
            >
              <SelectBoxItem value="Translucide" />
              <SelectBoxItem value="Orangée" />
              <SelectBoxItem value="Floue" />
            </SelectBox>
          </label>
        </Col>

        <Col className="flex flex-col gap-3 md:mt-9">
          <label>
            <span className="block">Macula:</span>
            <SelectBox
              value={consData.macula}
              onValueChange={(value) =>
                setConsData((v) => ({ ...v, macula: value }))
              }
            >
              <SelectBoxItem value="Saine" />
              <SelectBoxItem value="Cicatrice" />
              <SelectBoxItem value="Drusen" />
              <SelectBoxItem value="Sudats moue" />
            </SelectBox>
          </label>
          <label>
            <span className="block">Vaisseaux:</span>
            <SelectBox
              value={consData.vaisseau}
              onValueChange={(value) =>
                setConsData((v) => ({ ...v, vaisseau: value }))
              }
            >
              <SelectBoxItem value="Trajects normaux" />
              <SelectBoxItem value="Callibres normaux" />
              <SelectBoxItem value="Callibres anormaux" />
            </SelectBox>
          </label>
        </Col>
      </Grid>

      <Grid numCols={1} numColsMd={2} className="mt-3 gap-3">
        <Col className="flex flex-col gap-3">
          <Subtitle>Finalisation</Subtitle>
          <label>
            <span className="block">Diagnostique:</span>
            {!!diagnostics && (
              <MultiSelectBox
                value={!!diagnostic_id ? [`${diagnostic_id}`] : undefined}
                onValueChange={(value) => setDiagnostic_id(+value[0])}
              >
                {diagnostics?.map((d, i) => (
                  <MultiSelectBoxItem key={i} value={d.id + ""} text={d.name} />
                ))}
              </MultiSelectBox>
            )}
          </label>
        </Col>
        <Col className="md:mt-9">
          <label>
            <span className="block">Examens:</span>
            {!!exams && (
              <MultiSelectBox
                value={selectedExams.map((e) => e + "")}
                onValueChange={(value) => setSelectedExams(value)}
              >
                {exams?.map((e, i) => (
                  <MultiSelectBoxItem
                    key={i}
                    value={e.id + ""}
                    text={`${e.name} (${e.price} FCFA)`}
                  />
                ))}
              </MultiSelectBox>
            )}
          </label>
        </Col>
      </Grid>
      <Button loading={consMutation.isLoading} color="orange">
        Enregistrer la consultation
      </Button>
    </form>
  );
}
