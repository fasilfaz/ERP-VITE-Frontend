import { useEffect, useState, useRef } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import { useDispatch } from "react-redux";
import { EyeOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { Modal, Button, Table } from "antd";
import "./InvoiceStyles.module.css";

const BillsPage = () => {
  const componentRef = useRef(null); // Initialize the ref
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // Fetch all bills from API
  const getAllBills = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("http://localhost:5000/api/bills/get-bills");
      setBillsData(data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.error(error);
    }
  };

  useEffect(() => {
    getAllBills();
  }, []);

  // Print functionality
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });
  // Table columns configuration
  const columns = [
    { title: "ID", dataIndex: "_id" },
    { title: "Customer Name", dataIndex: "customerName" },
    { title: "Contact No", dataIndex: "customerNumber" },
    { title: "Subtotal", dataIndex: "subTotal" },
    { title: "Tax", dataIndex: "tax" },
    { title: "Total Amount", dataIndex: "totalAmount" },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <EyeOutlined
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectedBill(record);
            setPopupModal(true);
          }}
        />
      ),
    },
  ];

  return (
    <Sidebar>
      <div className="d-flex justify-content-between">
        <h1>Invoice List</h1>
      </div>

      <Table columns={columns} dataSource={billsData} bordered />

      {popupModal && (
        <Modal
          width={400}
          title="Invoice Details"
          visible={popupModal}
          onCancel={() => setPopupModal(false)}
          footer={null}
        >
          <div id="invoice-POS" ref={componentRef}>
            <center id="top">
              <div className="info">
                <h2>NEON Sports</h2>
                <p>Contact: 9874563210 | Delhi, India</p>
              </div>
            </center>
            <div id="mid">
              <div className="mt-2">
                <p>
                  Customer Name: <b>{selectedBill?.customerName}</b>
                  <br />
                  Phone No: <b>{selectedBill?.customerNumber}</b>
                  <br />
                  Date: <b>{selectedBill?.date?.toString().substring(0, 10)}</b>
                  <br />
                </p>
                <hr style={{ margin: "5px" }} />
              </div>
            </div>
            <div id="bot">
              <div id="table">
                <table>
                  <tbody>
                    <tr className="tabletitle">
                      <td className="item">
                        <h2>Item</h2>
                      </td>
                      <td className="Hours">
                        <h2>Qty</h2>
                      </td>
                      <td className="Rate">
                        <h2>Price</h2>
                      </td>
                      <td className="Rate">
                        <h2>Total</h2>
                      </td>
                    </tr>
                    {selectedBill?.cartItems?.map((item, index) => (
                      <tr className="service" key={index}>
                        <td className="tableitem">
                          <p className="itemtext">{item.name}</p>
                        </td>
                        <td className="tableitem">
                          <p className="itemtext">{item.quantity}</p>
                        </td>
                        <td className="tableitem">
                          <p className="itemtext">{item.price}</p>
                        </td>
                        <td className="tableitem">
                          <p className="itemtext">{item.quantity * item.price}</p>
                        </td>
                      </tr>
                    ))}

                    <tr className="tabletitle">
                      <td />
                      <td />
                      <td className="Rate">
                        <h2>GST</h2>
                      </td>
                      <td className="payment">
                        <h2>Rs {selectedBill?.tax}</h2>
                      </td>
                    </tr>
                    <tr className="tabletitle">
                      <td />
                      <td />
                      <td className="Rate">
                        <h2>Grand Total</h2>
                      </td>
                      <td className="payment">
                        <h2>
                          <b>Rs {selectedBill?.totalAmount}</b>
                        </h2>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div id="legalcopy">
                <p className="legal">
                  <strong>Thank you for your order!</strong> 18% GST applied to the total amount.
                  Please note that this is a non-refundable amount. For assistance, contact 
                  <b> neonsports@example.com</b>.
                </p>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <Button type="primary" onClick={handlePrint}>
              Print
            </Button>
          </div>
        </Modal>
      )}
    </Sidebar>
  );
};

export default BillsPage;