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
  SelectBox,
  SelectBoxItem,
} from "@tremor/react";
import { IoTrashBinOutline } from "react-icons/io5";
import { Product, ProductsType } from "../types";
import HeaderPageContent from "../components/HeaderPageContent";
import { useState } from "react";
import { useQuery, useMutation } from "react-query";
import {
  allProducts,
  allTypes,
  createProduct,
  destroyProduct,
  updateProduct,
} from "../api";
import ModaleLayout from "../components/ModaleLayout";
import { useAuth } from "../context";
import Loader from "@/components/Loader";

export default function ProductsPage() {
  const [searchKey, setsearchKey] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const { isAdmin } = useAuth();
  const {
    data: patients,
    refetch,
    isLoading,
  } = useQuery<Product[]>(["patients"], allProducts);

  const deleteMutation = useMutation((data) => destroyProduct(data), {
    onSuccess: () => refetch(),
  });
  async function deleteProduct(id: any) {
    if (window.confirm("Etes vous sure de cette action?"))
      await deleteMutation.mutateAsync(id);
  }

  function handleEditModale(type: Product) {
    setSelected(type);
    setIsOpen(true);
  }
  if (isLoading) return <Loader />;

  return (
    <div>
      <Card>
        <HeaderPageContent
          title="Liste des types de produits"
          value={searchKey}
          onChange={setsearchKey}
          onAdd={isAdmin ? () => setIsOpen(true) : undefined}
          buttonLabel="Nouveau produit"
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell># ID</TableHeaderCell>
              <TableHeaderCell>Liéllé</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Quantité</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>PU Vente(FCFA)</TableHeaderCell>
              {isAdmin && (
                <>
                  <TableHeaderCell>PU Achat</TableHeaderCell>
                  <TableHeaderCell>Modifier</TableHeaderCell>
                  <TableHeaderCell>Supprimer</TableHeaderCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {!!patients &&
              patients?.map((p, i) => (
                <TableRow key={i}>
                  <TableCell>#{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>
                    <Badge>{p.type?.name}</Badge>
                  </TableCell>
                  <TableCell>{p.quantity}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell>{p.price}</TableCell>
                  {isAdmin && (
                    <>
                      <TableCell>{p.buyPrice}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleEditModale(p)}
                          color="pink"
                        >
                          Modif
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => deleteProduct(p.id)}
                          color="fuchsia"
                          icon={IoTrashBinOutline}
                        >
                          Sup
                        </Button>
                      </TableCell>
                    </>
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
        title={!selected ? "Nouveau produit" : "Modifier le produit"}
      >
        <ProductForm
          product={selected}
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
  product: Product | null;
  onSuccess: () => void;
};
function ProductForm({ product, onSuccess }: TypeFormProps) {
  const { isLoading, data: types } = useQuery<ProductsType[]>(
    ["types"],
    allTypes
  );
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [buyPrice, setBuyPrice] = useState(product?.price || 0);
  const [quantity, setQuantity] = useState(product?.quantity || 0);
  const [type_id, setType_id] = useState(product?.type.id || undefined);

  const spentMutation = useMutation(
    (data) => {
      if (!product) return createProduct(data);
      return updateProduct(product.id, data);
    },
    {
      onSuccess,
    }
  );
  async function handleSave(e: any) {
    e.preventDefault();
    await spentMutation.mutateAsync({
      name,
      description,
      price,
      buyPrice,
      quantity,
      type_id,
    } as any);
  }
  return (
    <form className="flex flex-col gap-3" onSubmit={handleSave}>
      <label>
        <span className="block">Cathégorie:</span>
        {!!types && (
          <SelectBox
            value={type_id + ""}
            onValueChange={(value) => setType_id(+value)}
          >
            {!!types &&
              (types?.map((type) => (
                <SelectBoxItem
                  key={type.id}
                  value={type.id + ""}
                  text={type.name}
                />
              )) as any)}
          </SelectBox>
        )}
      </label>
      <label>
        <span className="block">Libéllé du produit:</span>
        <TextInput
          value={name}
          onChange={({ target }) => setName(target.value)}
          placeholder="Ex: verres médicaux, Médicamant"
        />
      </label>
      <label>
        <span className="block">Prix de vente(FCFA):</span>
        <div className="tremor-TextInput-root relative w-full flex items-center min-w-[10rem] focus:outline-none focus:ring-2 bg-white focus:ring-blue-200 border-gray-300 rounded-md border shadow-sm text-gray-700">
          <input
            type="number"
            value={price}
            onChange={({ target }) => setPrice(+target.value)}
            className="tremor-TextInput-input w-full focus:outline-none bg-transparent text-gray-700 pl-4 pr-4 py-2 text-sm font-medium border-0 placeholder:text-gray-500"
          />
        </div>
      </label>
      <label>
        <span className="block">Prix d'achat(FCFA):</span>
        <div className="tremor-TextInput-root relative w-full flex items-center min-w-[10rem] focus:outline-none focus:ring-2 bg-white focus:ring-blue-200 border-gray-300 rounded-md border shadow-sm text-gray-700">
          <input
            type="number"
            value={buyPrice}
            onChange={({ target }) => setBuyPrice(+target.value)}
            className="tremor-TextInput-input w-full focus:outline-none bg-transparent text-gray-700 pl-4 pr-4 py-2 text-sm font-medium border-0 placeholder:text-gray-500"
          />
        </div>
      </label>
      <label>
        <span className="block">Quantité en stoque:</span>
        <div className="tremor-TextInput-root relative w-full flex items-center min-w-[10rem] focus:outline-none focus:ring-2 bg-white focus:ring-blue-200 border-gray-300 rounded-md border shadow-sm text-gray-700">
          <input
            type="number"
            value={quantity}
            onChange={({ target }) => setQuantity(+target.value)}
            className="tremor-TextInput-input w-full focus:outline-none bg-transparent text-gray-700 pl-4 pr-4 py-2 text-sm font-medium border-0 placeholder:text-gray-500"
          />
        </div>
      </label>
      <label>
        <span className="block">Description:</span>
        <div className="tremor-TextInput-root relative w-full flex items-center min-w-[10rem] focus:outline-none focus:ring-2 bg-white focus:ring-blue-200 border-gray-300 rounded-md border shadow-sm text-gray-700">
          <textarea
            value={description}
            onChange={({ target }) => setDescription(target.value)}
            className="tremor-TextInput-input w-full focus:outline-none bg-transparent text-gray-700 pl-4 pr-4 py-2 text-sm font-medium border-0 placeholder:text-gray-500"
            rows={2}
          ></textarea>
        </div>
      </label>
      <Button loading={spentMutation.isLoading}>Enrégistrer</Button>
    </form>
  );
}
