"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  function buildWhatsappLink() {
    const lines = items.map(
      (item) =>
        `${item.quantity}x ${item.product.name} - $${(
          item.product.price * item.quantity
        ).toFixed(2)}`
    );

    const message = [
      "Hola! Quiero hacer este pedido:",
      "",
      ...lines,
      "",
      `Total: $${subtotal.toFixed(2)}`,
      "",
      `Nombre: ${name}`,
      `Telefono: ${phone}`,
      `Direccion: ${address}`,
      notes ? `Notas: ${notes}` : null,
    ]
      .filter((line) => line !== null)
      .join("\n");

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  const canCheckout = items.length > 0 && name.trim() && phone.trim();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Tu carrito esta vacio</h1>
        <Link
          href="/"
          className="mt-4 inline-block rounded-full bg-pink-600 px-5 py-2 text-sm font-semibold text-white"
        >
          Ver catalogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Tu carrito</h1>

      <div className="mt-6 flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-pink-50">
              {item.product.images[0] ? (
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.product.name}</p>
              <p className="text-sm text-gray-500">
                ${item.product.price.toFixed(2)} c/u
              </p>
            </div>
            <div className="flex items-center rounded-full border border-gray-300">
              <button
                type="button"
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity - 1)
                }
                className="px-3 py-1 text-gray-600"
              >
                -
              </button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button
                type="button"
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity + 1)
                }
                className="px-3 py-1 text-gray-600"
              >
                +
              </button>
            </div>
            <p className="w-20 text-right font-semibold text-gray-900">
              ${(item.product.price * item.quantity).toFixed(2)}
            </p>
            <button
              type="button"
              onClick={() => removeItem(item.product.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end text-xl font-bold text-gray-900">
        Total: ${subtotal.toFixed(2)}
      </div>

      <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold text-gray-900">Datos de contacto</h2>
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Nombre *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Telefono *
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Direccion
            </label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Notas</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <a
            href={canCheckout ? buildWhatsappLink() : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!canCheckout}
            className={`mt-2 rounded-full px-5 py-2.5 text-center text-sm font-semibold text-white ${
              canCheckout
                ? "bg-green-600 hover:bg-green-700"
                : "pointer-events-none bg-gray-300"
            }`}
          >
            Enviar pedido por WhatsApp
          </a>
          {!canCheckout ? (
            <p className="text-xs text-gray-500">
              Completa tu nombre y telefono para enviar el pedido.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
