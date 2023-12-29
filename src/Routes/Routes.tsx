import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import FeeCollection from "../pages/Fee Collection/FeeCollection";
import FeeStructure from "../pages/Fee Structure/FeeStructure";
import FeeType from "../components/Fee Type/FeeType";
import Login from "../components/Login/Login";
import { RequireAuth } from "react-auth-kit";
import Setup from "../pages/Setup/Setup";

import FeeCategory from "../pages/Fee Category/FeeCategory";
import DiscountAllocationByClass from "@/components/DiscountAllocationByClass/DiscountAllocationByClass";
import AddDiscount from "@/components/AddDiscount/AddDiscount";
import DiscountApproval from "@/components/DiscountApproval/DiscountApproval";
import FeeCollectionStudent from "@/components/FeeCollectionStudent/FeeCollectionStudent";
import ApplicationForm from "@/pages/Application Form/ApplicationForm";
import MiscellaneousTypes from "@/components/MiscellaneousTypes/MiscellaneousTypes";
import Miscellaneous from "@/pages/Miscellaneous/Miscellaneous";
import Income from "@/components/Income/Income";
import Expense from "@/components/Expense/Expense";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Donor from "@/pages/Donor/Donor";
import DonarDetail from "@/pages/DonorDetail/DonorDetail";
import ReceiptsManagement from "@/components/ReceiptsManagement/ReceiptsManagement";
import PreviousBalance from "@/components/PreviousBalance/PreviousBalance";
import ReceiptsAdmin from "@/components/ReceiptsAdmin/ReceiptsAdmin";
import PaymentConfirmationManagement from "@/components/PaymentConfirmationManagement/PaymentConfirmationManagement";
import DueSummary from "@/components/DueSummary/DueSummary";
import StudentReport from "@/components/StudentReport/StudentReport";
import Students from "@/pages/Students/Students";
import GiveDiscount from "@/components/GiveDiscount/GiveDiscount";
import SingleDiscountCategory from "@/components/SingleDiscountCategory/SingleDiscountCategory";
import SingleClassDiscount from "@/components/SingleClassDiscount/SingleClassDiscount";
import NewDiscount from "@/components/NewDiscount/NewDiscount";
import { Backdrop, CircularProgress } from "@mui/material";
const TransferCertficate = lazy(() => import("@/pages/Transfer Certficate/TransferCertficate"));
// import TransferCertficate from "@/pages/Transfer Certficate/TransferCertficate";
import Concession from "@/pages/Concession/Concession";
import Transportation from "@/pages/Transportation/Transportation";
import Admission from "@/pages/Admmison/Admission";
import AddStudent from "@/pages/Admmison/AddStudent/AddStudent";

const RoutesView = () => {
  const routes = {
    "/login": <Login />,
    "/": (
      <RequireAuth loginPath="/login">
        <Dashboard />
      </RequireAuth>
    ),
    "/fee-structure/:id/:name": (
      <RequireAuth loginPath="/login">
        <FeeStructure />
      </RequireAuth>
    ),
    "/fee-structure/:id/:name/feetype": (
      <RequireAuth loginPath="/login">
        <FeeType />
      </RequireAuth>
    ),
    "/feecategory": (
      <RequireAuth loginPath="/login">
        <FeeCategory />
      </RequireAuth>
    ),
    "/collection": (
      <RequireAuth loginPath="/login">
        <FeeCollection />
      </RequireAuth>
    ),
    "/discount": (
      <RequireAuth loginPath="/login">
        <NewDiscount />
      </RequireAuth>
    ),
    "/give-discount": (
      <RequireAuth loginPath="/login">
        <GiveDiscount />
      </RequireAuth>
    ),
    "single-discount/:discountId": (
      <RequireAuth loginPath="/login">
        <SingleDiscountCategory />
      </RequireAuth>
    ),
    "class-discount/:classId/:className/:categoryId?": (
      <RequireAuth loginPath="/login">
        <SingleClassDiscount />
      </RequireAuth>
    ),
    "/add-discount/:id?": (
      <RequireAuth loginPath="/login">
        <AddDiscount />
      </RequireAuth>
    ),
    "/discount-allocation/:isEdit/:id?/:classId?/:discountName?": (
      <RequireAuth loginPath="/login">
        <DiscountAllocationByClass />
      </RequireAuth>
    ),
    "/discount-approval/:id": (
      <RequireAuth loginPath="/login">
        <DiscountApproval />
      </RequireAuth>
    ),
    "/pay/:id/:hasfeeStructure": (
      <RequireAuth loginPath="/login">
        <FeeCollectionStudent />
      </RequireAuth>
    ),
    "/studentReport/:id": (
      <RequireAuth loginPath="/login">
        <StudentReport />
      </RequireAuth>
    ),
    "/students": (
      <RequireAuth loginPath="/login">
        <Students />
      </RequireAuth>
    ),
    "/applicationform": (
      <RequireAuth loginPath="/login">
        <ApplicationForm />
      </RequireAuth>
    ),
    "/duelist": (
      <RequireAuth loginPath="/login">
        <DueSummary />
      </RequireAuth>
    ),
    "/miscellaneoustypes": (
      <RequireAuth loginPath="/login">
        <MiscellaneousTypes />
      </RequireAuth>
    ),
    "/miscellaneouscollection": (
      <RequireAuth loginPath="/login">
        <Miscellaneous />
      </RequireAuth>
    ),
    "/income": (
      <RequireAuth loginPath="/login">
        <Income />
      </RequireAuth>
    ),
    "/expense": (
      <RequireAuth loginPath="/login">
        <Expense />
      </RequireAuth>
    ),
    "/donor": (
      <RequireAuth loginPath="/login">
        <Donor />
      </RequireAuth>
    ),
    "/donordetail/:id": (
      <RequireAuth loginPath="/login">
        <DonarDetail />
      </RequireAuth>
    ),
    "/previous-balance": (
      <RequireAuth loginPath="/login">
        <PreviousBalance />
      </RequireAuth>
    ),
    "/setup": (
      <RequireAuth loginPath="/login">
        <Setup />
      </RequireAuth>
    ),
    "/receipts": (
      <RequireAuth loginPath="/login">
        <ReceiptsManagement />
      </RequireAuth>
    ),
    "/admin-receipts": (
      <RequireAuth loginPath="/login">
        <ReceiptsAdmin />
      </RequireAuth>
    ),
    "/payment-confirmations": (
      <RequireAuth loginPath="/login">
        <PaymentConfirmationManagement />
      </RequireAuth>
    ),
    "/transfer-certificates": (
      <RequireAuth loginPath="/login">
        <Suspense
          fallback={
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
              <CircularProgress color="inherit" />
            </Backdrop>
          }
        >
          <TransferCertficate />
        </Suspense>
      </RequireAuth>
    ),
    "/concession": (
      <RequireAuth loginPath="/login">
        <Concession />
      </RequireAuth>
    ),

    "/transportation": (
      <RequireAuth loginPath="/login">
        <Transportation />
      </RequireAuth>
    ),
    "/admission": (
      <RequireAuth loginPath="/login">
        <Admission />
      </RequireAuth>
    ),
    "/admission/add-student/:id": (
      <RequireAuth loginPath="/login">
        <AddStudent />
      </RequireAuth>
    ),
  };

  return (
    <Routes>
      {Object.entries(routes).map(([path, element]) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>
  );
};

export default RoutesView;
