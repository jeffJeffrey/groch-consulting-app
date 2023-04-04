import { Badge, Button, Subtitle, Title } from "@tremor/react";
import { useEffect, useMemo, useState } from "react";
import { Consultation, EyeglassesData, Payment, Prescription } from "../types";
import Logo from "../assets/images/logo-full.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { formatDate } from "../functions/dates";
import { createPayment } from "../api";
import { useMutation } from "react-query";
import { useAuth } from "../context";

type IProps = {
  consultation: Consultation;
  onSuccess: () => void;
};
export default function BillModal({ consultation, onSuccess }: IProps) {
  const [checkedProducts, setCheckedProducts] = useState<
    (Prescription & { checked: boolean })[]
  >([]);
  useEffect(() => {
    if (!!consultation.prescriptions)
      setCheckedProducts(
        consultation.prescriptions.map((p) => ({ ...p, checked: true }))
      );
  }, [consultation.prescriptions]);

  const filteredPres = useMemo(
    () => checkedProducts.filter((p) => p.checked),
    [checkedProducts]
  );

  const total = useMemo(() => {
    let stotal = 0;
    consultation.exams?.forEach((e) => {
      stotal += e.price;
    });
    filteredPres.forEach((p) => {
      if ((p.eyeglasses?.length || 0) < 2) {
        stotal += p.quantity * (p.product?.price || 0);
        return;
      }
      let price = (JSON.parse(p.eyeglasses + "") as EyeglassesData).price || 0;
      stotal += price;
    });
    return stotal;
  }, [filteredPres, consultation.exams]);
  const paymentMutation = useMutation<any, any, Payment>((data) =>
    createPayment(data)
  );
  const { user } = useAuth();
  const [loading, setloading] = useState(false);
  async function savePayments() {
    setloading(true);
    await Promise.all(
      filteredPres
        .filter((p) => p.quantity > 0)
        .map(async (pres) => {
          return await paymentMutation.mutateAsync({
            name: `Achat du produit ${pres.product?.name}`,
            price: pres.quantity * (pres.product?.price || 0),
            qunatity: pres.quantity,
            type: "product",
            patient_id: consultation.patient?.id,
            user_id: user?.id,
          });
        })
    );
    await Promise.all(
      consultation.exams?.map(async (exam) => {
        return await paymentMutation.mutateAsync({
          name: `Achat du produit ${exam?.name}`,
          price: exam.price,
          qunatity: 1,
          type: "exam",
          patient_id: consultation.patient?.id,
          user_id: user?.id,
        });
      }) || []
    );
    setloading(false);
    onSuccess();
  }
  async function print() {
    await savePayments();
    let pdf = new jsPDF();
    let data = document.getElementById("bill");
    if (!!data) {
      html2canvas(data, {
        allowTaint: true,
        useCORS: true,
      }).then((canvas) => {
        let imgdata = canvas.toDataURL("image/image.png");
        pdf.addImage(imgdata, "PNG", 30, 10, 150, 95);
        let date = formatDate(new Date());
        pdf.save(`recu-${consultation.id}-${date}.pdf`);
      });
    }
  }
  return (
    <div className="md:flex md:gap-3 mt-5">
      <div className="flex-auto">
        <Subtitle>Cochez les produits a facturer</Subtitle>
        <div>
          {checkedProducts.map((p) => (
            <div className="flex items-center mb-4" key={p.id}>
              <input
                id={"check" + p.id}
                type="checkbox"
                checked={p.checked}
                onChange={({ target }) =>
                  setCheckedProducts((prev) => {
                    return prev.map((item) => {
                      if (item.id !== p.id) return item;
                      return { ...item, checked: !item.checked };
                    });
                  })
                }
                className="w-4 h-4 text-[#F97316] bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-[#F97316] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor={"check" + p.id}
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {p.product?.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div id="bill" style={{ padding: "5px" }}>
          <div
            style={{
              display: "flex",
              minWidth: "400px",
              maxWidth: "400px",
              width: "100%",
              marginBottom: "10px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <img src={Logo} style={{ width: "60px", height: "60px" }} />
            <small>25/02/2023</small>
          </div>
          <div>
            <table>
              <tbody>
                <tr>
                  <th style={{ textAlign: "left", marginBottom: "10PX" }}>
                    FACTURE
                  </th>
                </tr>
                <tr>
                  <th style={{ textAlign: "left" }}>Consulté par :</th>
                  <td style={{ textAlign: "right" }}>
                    {consultation.user?.name}
                  </td>
                </tr>
              </tbody>
            </table>
            {filteredPres.length > 0 && (
              <h3 style={{ marginTop: "15px" }}>Produits</h3>
            )}

            <table>
              <tbody>
                {checkedProducts
                  .filter((o) => o.checked)
                  .map((o) => (
                    <tr key={o.id}>
                      <th style={{ textAlign: "left" }}>
                        {o.quantity} x {o.product?.name} :
                      </th>
                      <td style={{ textAlign: "right" }}>
                        {o.quantity * (o.product?.price || 1)} FCFA
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {(consultation.exams?.length || 0) > 0 && (
              <h3 style={{ marginTop: "15px" }}>Examens</h3>
            )}

            <table>
              <tbody>
                {consultation.exams?.map((e) => (
                  <tr key={e.id}>
                    <th style={{ textAlign: "left" }}>{e.name} : </th>
                    <td style={{ textAlign: "right" }}>{e.price} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              Total:
              <h2 style={{ display: "inline", marginLeft: "auto" }}>
                {total} FCFA
              </h2>
            </div>
          </div>
        </div>
        {consultation.billed ? (
          <Badge>Déja facturé</Badge>
        ) : (
          <Button loading={loading} onClick={print}>
            Enrégistrer les payements et imprimer la facture
          </Button>
        )}
      </div>
    </div>
  );
}
