// src/app/terms/page.jsx
import React from 'react';

export const metadata = {
  title: 'Terms & Conditions | SoulDistribution',
  description: 'Terms and conditions for SoulDistribution music distribution services.',
};

const TermsPage = () => {
  return (
    <div className=" w-full px-4 py-16 bg-gradient-to-b from-gray-900 to-black text-gray-200">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-purple-400">Terms & Conditions</h1>
        <div className="w-20 h-1 bg-purple-500 mb-6"></div>
        <p className="text-gray-400 mb-10 italic">Last updated: March 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">1. Distribution Plans & Pricing</h2>
            <h3 className="text-xl font-medium text-gray-300 mt-6 mb-3">Basic Plan (₹99/year)</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Perfect for new artists. You keep 0% royalties. Costs less than ₹10/month.</li>
              <li>Unlimited releases for 1 year.</li>
              <li>Distributed to 150+ Indian and international stores.</li>
              <li>Features like custom release dates, Spotify verification, Content ID, playlist pitching, Instagram audio linking, and more.</li>
              <li>24/7 support, approval in 24 hours, live in 2 days, lifetime availability, monthly revenue reports.</li>
              <li><strong className="text-purple-300">Collab rule:</strong> If you collaborate with an artist who isn't a Soul Distribution member, they must pay ₹99 (or any plan) to join.</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-300 mt-6 mb-3">Pro Plan (₹599/year)</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>For serious artists. You keep 50% royalties. Costs less than ₹50/month.</li>
              <li>Same features as Basic Plan.</li>
              <li>Includes 1 free collab artist.</li>
              <li><strong className="text-purple-300">Extra collab rule:</strong> If you collaborate with an artist who isn't a Soul Distribution member, you pay ₹149 for them as an extra collab. Once paid, they can upload unlimited music for 1 year (like the ₹99 plan). If they buy the ₹99 plan themselves, they pay an extra ₹50 to retain 50% royalties under your Pro Plan.</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-300 mt-6 mb-3">Premium Plan (₹1199/year)</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>For professional artists. You keep 100% royalties. Costs less than ₹100/month.</li>
              <li>Same features as Basic Plan.</li>
              <li>Includes 2 free collab artists.</li>
              <li><strong className="text-purple-300">Extra collab rule:</strong> If you collaborate with an artist who isn't a Soul Distribution member, you pay ₹149 for them as an extra collab. Once paid, they can upload unlimited music for 1 year (like the ₹99 plan). Alternatively, if they buy the ₹99 plan themselves, they pay an extra ₹50 to retain 100% royalties under your Premium Plan. If you pay ₹149 for them, they keep your royalty rate (50% for Pro, 100% for Premium) without extra cost.</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-300 mt-6 mb-3">YouTube OAC (Official Artist Channel) – ₹499</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Verified badge on YouTube</li>
              <li>Merging of all music content (albums, singles, music videos)</li>
              <li>Access to YouTube analytics and fan insights</li>
              <li>"Music" tag on videos</li>
              <li>Custom artist profile and banner</li>
              <li>Higher search ranking and better visibility</li>
              <li><strong className="text-purple-300">Important Terms:</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-400">
                  <li>You receive the verified badge and not payment for that after multiple warnings</li>
                  <li>You are solely responsible for any actions we may take</li>
                  <li>You will receive 100% royalties until you get the verification page</li>
                  <li>Songs remain available for lifetime, but no revenue will be generated until you subscribe to a royalty plan (₹599 or ₹1199)</li>
                  <li>You have full rights to remove your music at any time after OAC plan payment</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">2. Plan Upgrades & Royalty Calculations</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>You can upgrade your plan anytime (e.g., from ₹99 to ₹599).</li>
              <li>Money paid for your old plan won't be counted or refunded toward the new plan.</li>
              <li>Royalties are split based on the days you were on each plan in a month.</li>
              <li className="pt-2"><strong className="text-purple-300">Example:</strong> If you switch from ₹99 (0% royalties) to ₹599 (50% royalties) on April 15, and April revenue is ₹30,000:
                <ul className="list-disc pl-6 pt-2 space-y-1 text-gray-400">
                  <li>Total days in April = 30.</li>
                  <li>First 15 days (₹99 plan) = ₹30,000 ÷ 30 × 15 = ₹15,000 (0% royalties = ₹0).</li>
                  <li>Next 15 days (₹599 plan) = ₹15,000 × 50% = ₹7,500.</li>
                  <li>You'd get ₹7,500 for April.</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">3. Content Ownership & Copyright Rules</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>All music must be 100% original (no stolen beats, samples, or lyrics).</li>
              <li>If you use purchased beats or collabs, you must have permission (proof may be asked).</li>
              <li>We're not responsible for copyright issues – that's on you.</li>
            </ul>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">4. Revenue Payments & Withdrawal Methods</h2>
            <p className="mb-4 text-gray-300">
              Earnings are paid via the Distributor through GPay, bank transfer, or PayPal.
              A 15% U.S. tax is applied to your earnings under the India-U.S. tax treaty.
              Processing takes 1-7 business days.
            </p>
            <p className="mb-4 text-gray-300">Payout fees apply as follows:</p>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-700 my-4">
                <thead>
                  <tr className="bg-gray-900">
                    <th className="border border-gray-700 p-2 text-left text-purple-300">Payout Method</th>
                    <th className="border border-gray-700 p-2 text-left text-purple-300">Fee</th>
                    <th className="border border-gray-700 p-2 text-left text-purple-300">Minimum Payout Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-700 p-2 text-gray-300">PayPal (US Residents)</td>
                    <td className="border border-gray-700 p-2 text-gray-300">2% (Max $1.00)</td>
                    <td className="border border-gray-700 p-2 text-gray-300">$1.00</td>
                  </tr>
                  <tr className="bg-gray-850">
                    <td className="border border-gray-700 p-2 text-gray-300">PayPal (Non-US Residents)</td>
                    <td className="border border-gray-700 p-2 text-gray-300">2% (Max $21.00)</td>
                    <td className="border border-gray-700 p-2 text-gray-300">$1.00</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 p-2 text-gray-300">Bank Transfer</td>
                    <td className="border border-gray-700 p-2 text-gray-300">Varies based on your bank</td>
                    <td className="border border-gray-700 p-2 text-gray-300">$5.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-300">If your plan expires and you don't renew, earnings pause until you renew. You won't lose paused earnings if you renew within 7 days; after that, they're gone.</p>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">5. Refund Policy</h2>
            <p className="mb-4 text-gray-300">Full refund is available if:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Your music hasn't been distributed yet.</li>
              <li>Your YouTube Official Artist Channel (OAC) request is rejected.</li>
            </ul>
            <p className="mt-4 text-gray-300">No refund if distribution starts or OAC is under review.</p>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">6. Distributor Migration</h2>
            <p className="text-gray-300">
              Want to leave? We'll give you your metadata, audio files, cover art, revenue charts, and permissions within 7 days of your request.
            </p>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">7. Contract Termination</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>You can end your plan anytime with written notice.</li>
              <li>Your music stays live, but earnings pause until fees are cleared or you renew.</li>
            </ul>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">8. Analytics & Reporting</h2>
            <p className="text-gray-300">
              Monthly reports show streams, revenue, and analytics.
            </p>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">9. Legal Jurisdiction</h2>
            <p className="text-gray-300">
              Indian law applies. Disputes are settled by discussion or Indian courts.
            </p>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">10. LANDR Partnership Terms</h2>
            <p className="text-gray-300">
              As Soul Distribution uses LANDR for distribution services, all applicable LANDR terms and conditions also apply to your music distribution. By using Soul Distribution services, you agree to comply with both Soul Distribution and LANDR terms and conditions.
            </p>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">11. Exclusivity Requirements</h2>
            <p className="text-gray-300">
              The Artist cannot distribute the same track through multiple distributors simultaneously. However, the Artist may distribute different songs through other distributors, provided those songs are not distributed by Soul Distribution.
            </p>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">12. Terms Acceptance</h2>
            <p className="text-gray-300">
              By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;