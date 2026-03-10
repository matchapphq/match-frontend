import { CreditCard, ShieldAlert } from 'lucide-react';

export function PaymentRequired() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] p-4 sm:p-8">
      <div className="mx-auto flex min-h-[75vh] w-full max-w-3xl items-center justify-center">
        <section className="w-full rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/80 sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 dark:from-[#5a03cf]/20 dark:to-[#9cff02]/20">
            <CreditCard className="h-8 w-8 text-[#5a03cf] dark:text-[#7a23ef]" />
          </div>

          <h1 className="mt-6 text-center text-2xl text-gray-900 dark:text-white sm:text-3xl">
            Moyen de paiement requis
          </h1>

          <p className="mt-3 text-center text-sm leading-6 text-gray-600 dark:text-gray-400 sm:text-base">
            Vous devez configurer un moyen de paiement pour poursuivre l&apos;activation de votre établissement.
          </p>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-900/20">
            <p className="flex items-start gap-3 text-sm text-amber-800 dark:text-amber-300">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Cette page sera complétée avec les actions Stripe au prochain lot.</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
