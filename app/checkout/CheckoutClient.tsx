"use client";

import Script from "next/script";
import { FormEvent, useState } from "react";
import styles from "./checkout.module.css";

type ConektaIntegration = (options: {
  config: {
    locale: string;
    publicKey: string;
    targetIFrame: string;
    checkoutRequestId: string;
  };
  callbacks: {
    onFinalizePayment: () => void;
    onErrorPayment: () => void;
  };
  options: {
    backgroundMode: string;
    colorPrimary: string;
    colorText: string;
    colorLabel: string;
    inputType: string;
    autoResize: boolean;
  };
}) => void;

declare global {
  interface Window {
    ConektaCheckoutComponents?: { Integration?: ConektaIntegration };
  }
}

type CheckoutClientProps = {
  productId: string;
  publicKey: string;
};

export default function CheckoutClient({ productId, publicKey }: CheckoutClientProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "">("");
  const [checkoutVisible, setCheckoutVisible] = useState(false);

  function showError(text: string) {
    setMessage(text);
    setMessageType("error");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (!publicKey || !window.ConektaCheckoutComponents?.Integration) {
      showError("No se pudo cargar el servicio de pago. Inténtalo nuevamente.");
      return;
    }

    const formData = new FormData(form);
    const customer = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
    };

    setLoading(true);
    try {
      const response = await fetch("/api/conekta/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1, customer }),
      });
      const data = (await response.json()) as { checkoutRequestId?: string };
      if (!response.ok || !data.checkoutRequestId) throw new Error("Order unavailable");

      setCheckoutVisible(true);
      window.ConektaCheckoutComponents.Integration({
        config: {
          locale: "es",
          publicKey,
          targetIFrame: "#conekta-checkout",
          checkoutRequestId: data.checkoutRequestId,
        },
        callbacks: {
          onFinalizePayment: () => {
            setMessage("Pago recibido. Estamos confirmando tu operación.");
            setMessageType("success");
          },
          onErrorPayment: () => {
            setCheckoutVisible(false);
            setLoading(false);
            showError("No se pudo completar el pago. Inténtalo nuevamente.");
          },
        },
        options: {
          backgroundMode: "lightMode",
          colorPrimary: "#276749",
          colorText: "#24352d",
          colorLabel: "#50645a",
          inputType: "minimalMode",
          autoResize: true,
        },
      });
    } catch {
      setLoading(false);
      showError("No se pudo iniciar el pago. Inténtalo nuevamente.");
    }
  }

  return (
    <>
      <Script
        src="https://pay.conekta.com/v1.0/js/conekta-checkout.min.js"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      {!checkoutVisible && (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="checkout-name">Nombre completo</label>
            <input id="checkout-name" name="name" type="text" minLength={2} maxLength={120} autoComplete="name" required />
          </div>
          <div className={styles.field}>
            <label htmlFor="checkout-email">Correo electrónico</label>
            <input id="checkout-email" name="email" type="email" maxLength={254} autoComplete="email" required />
          </div>
          <div className={styles.field}>
            <label htmlFor="checkout-phone">Teléfono</label>
            <input id="checkout-phone" name="phone" type="tel" minLength={8} maxLength={20} pattern="\\+?[0-9][0-9\\s()\\-]{7,19}" placeholder="5512345678" autoComplete="tel" required />
          </div>
          <button className={styles.submit} type="submit" disabled={loading}>
            {loading ? "Iniciando pago..." : "Continuar al pago"}
          </button>
        </form>
      )}
      <p className={messageType === "error" ? styles.error : messageType === "success" ? styles.success : styles.message} role="status" aria-live="polite">
        {message}
      </p>
      <div id="conekta-checkout" className={checkoutVisible ? styles.checkout : styles.checkoutHidden} />
    </>
  );
}
