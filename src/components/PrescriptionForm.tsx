import { PlusIcon } from "@heroicons/react/solid";
import {
  Subtitle,
  Callout,
  TabList,
  Tab,
  SelectBox,
  SelectBoxItem,
  TextInput,
  Button,
  Title,
  Flex,
  MultiSelectBox,
  MultiSelectBoxItem,
} from "@tremor/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  allProducts,
  allTypes,
  createPrescription,
  destroyPrescription,
} from "../api";
import {
  Consultation,
  EyeglassesData,
  Prescription,
  Product,
  ProductsType,
} from "../types";
import ModaleLayout from "./ModaleLayout";

type PrescriptionFormProps = {
  consultation: Consultation;
  onSuccess: () => void;
};

export function PrescriptionForm(props: PrescriptionFormProps) {
  const { data: types } = useQuery<ProductsType[]>(["types"], allTypes);
  const { data: products } = useQuery<Product[]>(["products"], allProducts);
  const { consultation, onSuccess } = props;
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<number>();
  const [loating, setloating] = useState(false);

  useEffect(() => {
    if (!!consultation) setPrescriptions(consultation.prescriptions || []);
  }, [consultation]);

  const handleAddPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      { product_id: "", quantity: 1, note: "" },
    ]);
  };

  const handleRemovePrescription = async (index: number) => {
    if (!!prescriptions[index].id) {
      await deletePrescriptionMutation.mutateAsync(prescriptions[index].id);
    }
    const newPrescriptions = [...prescriptions];
    newPrescriptions.splice(index, 1);
    setPrescriptions(newPrescriptions);
  };

  const handlePrescriptionChange = (
    index: number,
    field: "product_id" | "quantity" | "note" | "eyeglasses",
    value: any
  ) => {
    const newPrescriptions = [...prescriptions];
    (newPrescriptions[index][field] as any) = value;
    setPrescriptions(newPrescriptions);
  };

  async function handleSave(e: any) {
    e.preventDefault();
    setloating(true);
    await Promise.all(
      prescriptions
        .filter((p) => {
          const product = products?.find((pr) => p.product_id === pr.id);
          if (!product) return false;
          return !p.id && product.quantity >= p.quantity;
        })
        .map(async (pres) => {
          return await prescriptionMutation.mutateAsync({
            ...pres,
            consultation_id: consultation.id,
          });
        })
    )
      .then(onSuccess)
      .finally(() => setloating(false));
  }

  const prescriptionMutation = useMutation<any, any, any>((data) =>
    createPrescription(data)
  );

  const deletePrescriptionMutation = useMutation<any, any, any>((id) =>
    destroyPrescription(id)
  );

  return (
    <form onSubmit={handleSave}>
      <div className="mt-3 flex flex-col gap-3">
        <Subtitle>Prescriptions</Subtitle>
        {!types ? (
          <Callout title="Information!">
            Veillez Enrégistrer des types et des produits
          </Callout>
        ) : (
          <>
            {prescriptions.map((prescription, index) => (
              <Fragment key={index}>
                <div className="flex flex-col gap-3">
                  <Flex>
                    <Title>Prescription {index + 1}</Title>
                    <Button
                      color="fuchsia"
                      type="button"
                      onClick={() => handleRemovePrescription(index)}
                    >
                      Suprimer
                    </Button>
                  </Flex>
                  <label>
                    <span className="block">Produit:</span>
                    {!!products && (
                      <>
                        {!prescription.id ? (
                          <MultiSelectBox
                            value={
                              prescription.product_id
                                ? [prescription.product_id + ""]
                                : undefined
                            }
                            onValueChange={(value) =>
                              handlePrescriptionChange(
                                index,
                                "product_id",
                                +value[0]
                              )
                            }
                          >
                            {products?.map((d, i) => (
                              <MultiSelectBoxItem
                                key={i}
                                value={d.id + ""}
                                text={`${d.name} (${d.type.name})`}
                              />
                            ))}
                          </MultiSelectBox>
                        ) : (
                          // <SelectBox
                          //   value={prescription.product_id + ""}
                          //   onValueChange={(v) =>
                          //     handlePrescriptionChange(index, "product_id", +v)
                          //   }
                          // >
                          //   {products?.map((p) => (
                          //     <SelectBoxItem
                          //       key={p.id}
                          //       value={p.id + ""}
                          //       text={`${p.name} (${p.type.name})`}
                          //     />
                          //   ))}
                          // </SelectBox>
                          <TextInput
                            disabled
                            value={`${prescription.product?.name}`}
                          />
                        )}
                      </>
                    )}
                  </label>
                  <label>
                    <span className="block">Quantité:</span>
                    <div className="tremor-TextInput-root relative w-full flex items-center min-w-[10rem] focus:outline-none focus:ring-2 bg-white focus:ring-blue-200 border-gray-300 rounded-md border shadow-sm text-gray-700">
                      <input
                        type="number"
                        disabled={!!prescription.id}
                        value={prescription.quantity}
                        min={0}
                        max={prescription.product?.quantity}
                        onChange={({ target }) => {
                          const product = products?.find(
                            (p) => p.id === prescription.product_id
                          );
                          if (
                            product &&
                            +target.value <= (product.quantity || 0)
                          )
                            handlePrescriptionChange(
                              index,
                              "quantity",
                              +target.value
                            );
                        }}
                        className="tremor-TextInput-input w-full focus:outline-none bg-transparent text-gray-700 pl-4 pr-4 py-2 text-sm font-medium border-0 placeholder:text-gray-500"
                      />
                    </div>
                  </label>
                  <div className="flex">
                    {!prescription.eyeglasses ||
                    prescription.eyeglasses.length <= 1 ? (
                      <>
                        {!prescription.id && (
                          <button
                            className=" text-[#F97316] block"
                            type="button"
                            onClick={() => {
                              setSelected(index);
                              setModalOpen(true);
                            }}
                          >
                            Options pour les lunettes médicaux
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="">
                        Options pour lunettes ajoutées:
                        {displayeyeglassOptions(prescription.eyeglasses)}
                      </div>
                    )}
                  </div>
                  <label>
                    <span className="block">Note:</span>
                    <TextInput
                      value={prescription.note}
                      disabled={!!prescription.id}
                      onChange={({ target }) =>
                        handlePrescriptionChange(index, "note", target.value)
                      }
                      placeholder=""
                    />
                  </label>
                </div>
              </Fragment>
            ))}
            <div className="flex flex-row-reverse">
              <Button
                icon={PlusIcon}
                type="button"
                disabled={consultation.billed}
                onClick={handleAddPrescription}
              >
                ADD
              </Button>
            </div>
            <div className="mt-3">
              <Button
                loading={loating}
                disabled={consultation.billed}
                color="orange"
              >
                Enrégistrer
              </Button>
            </div>
          </>
        )}
      </div>
      <ModaleLayout
        title="Options pour lunettes médicaux"
        isOpen={modalOpen}
        closeModal={() => {
          setSelected(undefined);
          setModalOpen(false);
        }}
      >
        <EyeglassOptions
          onOk={(value: string) => {
            handlePrescriptionChange(selected || 0, "eyeglasses", value);
            setModalOpen(false);
          }}
        />
      </ModaleLayout>
    </form>
  );
}

type Iprops = {
  onOk: (value: string) => void;
};
function EyeglassOptions({ onOk }: Iprops) {
  const [data, setData] = useState<EyeglassesData>({
    sphereLeftEye: "",
    sphereRightEye: "",
    cylindreLeft: "",
    cylindreRight: "",
    axeRight: "",
    axeLeft: "",
    additionLeft: "",
    additionRight: "",
    photochromic: false,
    antireflect: false,
    blueProtect: false,
    doubleFoyer: false,
    progressif: false,
    portConstant: false,
    price: undefined,
  });
  return (
    <div>
      <div className="md:flex md:gap-4">
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            <label>
              <span className="block">Sphere oeuil gauche:</span>
              <TextInput
                value={data.sphereLeftEye}
                onChange={({ target }) =>
                  setData((x) => ({ ...x, sphereLeftEye: target.value }))
                }
                placeholder=""
              />
            </label>
            <label>
              <span className="block">Sphere oeuil droit:</span>
              <TextInput
                value={data.sphereRightEye}
                onChange={({ target }) =>
                  setData((x) => ({ ...x, sphereRightEye: target.value }))
                }
                placeholder=""
              />
            </label>
            <label>
              <span className="block">Cylindre oeuil gauche:</span>
              <TextInput
                value={data.cylindreLeft}
                onChange={({ target }) =>
                  setData((x) => ({ ...x, cylindreLeft: target.value }))
                }
                placeholder=""
              />
            </label>
            <label>
              <span className="block">Cylindre oeuil droit:</span>
              <TextInput
                value={data.cylindreRight}
                onChange={({ target }) =>
                  setData((x) => ({ ...x, cylindreRight: target.value }))
                }
                placeholder=""
              />
            </label>
          </div>
          <div className="flex flex-col gap-3">
            <label>
              <span className="block">Axe oeuil gauche:</span>
              <TextInput
                value={data.axeLeft}
                onChange={({ target }) =>
                  setData((x) => ({ ...x, axeLeft: target.value }))
                }
                placeholder=""
              />
            </label>
            <label>
              <span className="block">Axe oeuil droit:</span>
              <TextInput
                value={data.axeRight}
                onChange={({ target }) =>
                  setData((x) => ({ ...x, axeRight: target.value }))
                }
                placeholder=""
              />
            </label>
            <label>
              <span className="block">Addition oeuil gauche:</span>
              <TextInput
                value={data.additionLeft}
                onChange={({ target }) =>
                  setData((x) => ({ ...x, additionLeft: target.value }))
                }
                placeholder=""
              />
            </label>
            <label>
              <span className="block">Addition oeuil droit:</span>
              <TextInput
                value={data.additionRight}
                onChange={({ target }) =>
                  setData((x) => ({ ...x, additionRight: target.value }))
                }
                placeholder=""
              />
            </label>
          </div>
        </div>
      </div>
      <div className="mt-4 md:flex md:gap-4">
        <div>
          <div className="flex items-center mb-4">
            <input
              id="Photochromique"
              type="checkbox"
              checked={data.photochromic}
              onChange={({ target }) =>
                setData((v) => ({ ...v, photochromic: target.checked }))
              }
              className="w-4 h-4 text-[#F97316] bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-[#F97316] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="Photochromique"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Photochromique
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input
              id="antireflect"
              type="checkbox"
              checked={data.antireflect}
              onChange={({ target }) =>
                setData((v) => ({ ...v, antireflect: target.checked }))
              }
              className="w-4 h-4 text-[#F97316] bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-[#F97316] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="antireflect"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Antireflet
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input
              id="blueProtect"
              type="checkbox"
              checked={data.blueProtect}
              onChange={({ target }) =>
                setData((v) => ({ ...v, blueProtect: target.checked }))
              }
              className="w-4 h-4 text-[#F97316] bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-[#F97316] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="blueProtect"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Blue protect
            </label>
          </div>
        </div>
        <div>
          <div className="flex items-center mb-4">
            <input
              id="doubleFoyer"
              type="checkbox"
              checked={data.doubleFoyer}
              onChange={({ target }) =>
                setData((v) => ({ ...v, doubleFoyer: target.checked }))
              }
              className="w-4 h-4 text-[#F97316] bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-[#F97316] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="doubleFoyer"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Double Foyer
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input
              id="progressif"
              type="checkbox"
              checked={data.progressif}
              onChange={({ target }) =>
                setData((v) => ({ ...v, progressif: target.checked }))
              }
              className="w-4 h-4 text-[#F97316] bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-[#F97316] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="progressif"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Progressif
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input
              id="portConstant"
              type="checkbox"
              checked={data.portConstant}
              onChange={({ target }) =>
                setData((v) => ({ ...v, portConstant: target.checked }))
              }
              className="w-4 h-4 text-[#F97316] bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-[#F97316] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="portConstant"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Port constant
            </label>
          </div>
        </div>
      </div>
      <label>
        <span className="block">Prix (FCFA):</span>
        <div className="tremor-TextInput-root relative w-full flex items-center min-w-[10rem] focus:outline-none focus:ring-2 bg-white focus:ring-blue-200 border-gray-300 rounded-md border shadow-sm text-gray-700">
          <input
            type="number"
            value={data.price}
            min={0}
            onChange={({ target }) =>
              setData((x) => ({ ...x, price: +target.value }))
            }
            className="tremor-TextInput-input w-full focus:outline-none bg-transparent text-gray-700 pl-4 pr-4 py-2 text-sm font-medium border-0 placeholder:text-gray-500"
          />
        </div>
      </label>
      <Button
        className="mt-3"
        color="orange"
        type="button"
        onClick={() => onOk(JSON.stringify(data))}
      >
        Confirmer
      </Button>
    </div>
  );
}

function displayeyeglassOptions(json: string) {
  const obj: EyeglassesData = JSON.parse(json);

  let str = `
  Sphère gauche: ${obj.sphereLeftEye}, Sphère droite: ${obj.sphereRightEye},
  Cylindre gauche: ${obj.cylindreLeft}, Cylindre droite: ${obj.cylindreRight},
  Axe gauche: ${obj.axeLeft}, Axe droite: ${obj.axeRight},
  
  `;

  return (
    <div className="md:flex md:gap-7">
      <table>
        <tr>
          <th>Sphère gauche :</th>
          <td>{obj.sphereLeftEye}</td>
        </tr>
        <tr>
          <th>Sphère droite :</th>
          <td>{obj.sphereRightEye}</td>
        </tr>
        <tr>
          <th>Cylindre gauche :</th>
          <td>{obj.cylindreLeft}</td>
        </tr>
        <tr>
          <th>Cylindre droit :</th>
          <td>{obj.cylindreRight}</td>
        </tr>
        <tr>
          <th>Axe gauche :</th>
          <td>{obj.axeLeft}</td>
        </tr>
        <tr>
          <th>Axe droit :</th>
          <td>{obj.axeRight}</td>
        </tr>
        <tr>
          <th>Addition droit :</th>
          <td>{obj.additionLeft}</td>
        </tr>
      </table>
      <table>
        <tr>
          <th>Sphère gauche :</th>
          <td>{obj.additionRight}</td>
        </tr>
        <tr>
          <th>Sphère droite :</th>
          <td>{obj.photochromic ? "OUI" : "NON"}</td>
        </tr>
        <tr>
          <th>Cylindre gauche :</th>
          <td>{obj.antireflect ? "OUI" : "NON"}</td>
        </tr>
        <tr>
          <th>Cylindre droit :</th>
          <td>{obj.blueProtect ? "OUI" : "NON"}</td>
        </tr>
        <tr>
          <th>Axe gauche :</th>
          <td>{obj.doubleFoyer ? "OUI" : "NON"}</td>
        </tr>
        <tr>
          <th>Axe droit :</th>
          <td>{obj.progressif ? "OUI" : "NON"}</td>
        </tr>
        <tr>
          <th>Addition droit :</th>
          <td>{obj.portConstant ? "OUI" : "NON"}</td>
        </tr>
      </table>
    </div>
  );
}
