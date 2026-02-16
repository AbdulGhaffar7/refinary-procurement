import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import Loading from "./components/Common/Loading";

// Lazy load pages
const CatalogPage = lazy(() => import("./pages/Catalog"));
const PurchaseOrders = lazy(() => import("./pages/PurchaseOrders"));
const PurchaseOrderDetails = lazy(() => import("./pages/PurchaseOrderDetails"));

function App() {
  return (
    <Router>
      <MainLayout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<CatalogPage />} />
          </Routes>
          <Routes>
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
          </Routes>
          <Routes>
            <Route
              path="/purchase-order/:poNumber"
              element={<PurchaseOrderDetails />}
            />
          </Routes>
        </Suspense>
      </MainLayout>
    </Router>
  );
}

export default App;
