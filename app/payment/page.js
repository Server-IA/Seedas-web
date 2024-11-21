'use client'
import { useSearchParams } from "next/navigation";
import React from "react";
import Payment from "../components/payment";

function PaymentPage() {
    const searchParam = useSearchParams();
    const amount = parseFloat(searchParam.get('amount'));

    if (isNaN(amount)) {
        return <div>Error: Monto inválido</div>;
    }

    return (
        <Payment price={amount} />
    );
}

export default PaymentPage;
