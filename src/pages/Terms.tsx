import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-gradient-metal">
              Terms &amp; Conditions
            </h1>
            
            <Card className="p-8 md:p-12 shadow-metal bg-card/50 backdrop-blur space-y-8">

              <div>
                <h2 className="text-2xl font-display font-bold mb-3 text-primary">1. General</h2>
                <p className="text-muted-foreground mb-2">
                  All bookings made with Travel in Supreme Style are accepted on the basis of the Terms &amp; Conditions outlined on this website. By placing an order through our website, by phone, or via email, you confirm that you are over 18 years old and legally capable of entering into a binding contract.
                </p>
                <p className="text-muted-foreground">
                  We may update these Terms at any time without prior notice. You are responsible for reviewing this page periodically to ensure you are aware of the current Terms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold mb-3 text-primary">2. Vehicle Provision</h2>
                <p className="text-muted-foreground mb-2">
                  We will always endeavour to supply the exact vehicle type requested at the time of booking. However, we reserve the right to provide an alternative make or model of equivalent standard if necessary.
                </p>
                <p className="text-muted-foreground mb-2">
                  If you require a specific make or model without substitution, this must be stated at the time of booking.
                </p>
                <p className="text-muted-foreground mb-2">
                  All Travel in Supreme Style vehicles operate a strict No Smoking / No Vaping policy.
                </p>
                <p className="text-muted-foreground">
                  Consumption of food or alcohol is not permitted unless it forms part of a pre-arranged package or has been agreed in advance.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold mb-3 text-primary">3. Short-Notice Bookings</h2>
                <p className="text-muted-foreground">
                  For bookings required within 24 hours, please contact us directly by phone or email.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold mb-3 text-primary">4. Delays, Liability &amp; Safety</h2>
                <p className="text-muted-foreground mb-2">
                  While we make every effort to ensure punctuality, we accept no liability for missed flights, events, loss or damage to personal belongings, or any consequential losses caused by circumstances beyond our control, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mb-2">
                  <li>Traffic delays</li>
                  <li>Accidents</li>
                  <li>Congestion</li>
                  <li>Severe weather</li>
                  <li>Theft</li>
                  <li>Road closures</li>
                  <li>Acts of God</li>
                </ul>
                <p className="text-muted-foreground mb-2">
                  Drivers will always operate within legal speed limits. Clients must not request or encourage drivers to exceed these limits.
                </p>
                <p className="text-muted-foreground">
                  Vehicles are valeted to a high standard prior to hire. We cannot accept responsibility for changes to the vehicle's external appearance caused by weather or road conditions during the hire period.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold mb-3 text-primary">5. Damage &amp; Soiling</h2>
                <p className="text-muted-foreground mb-2">
                  Clients are responsible for any damage or soiling caused to the interior or exterior of the vehicle during the hire period.
                </p>
                <p className="text-muted-foreground mb-2">
                  Charges for cleaning, repairs, or reinstatement will be invoiced within 7 days.
                </p>
                <p className="text-muted-foreground">
                  If the damage results in the vehicle being unavailable for subsequent bookings, the client will be charged for the loss of hire.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold mb-3 text-primary">6. Subcontracting &amp; Breakdowns</h2>
                <p className="text-muted-foreground mb-2">
                  We reserve the right to use subcontracted vehicles when required.
                </p>
                <p className="text-muted-foreground">
                  In the event of a breakdown or accident prior to the booking date, we will make every effort to provide a similar or alternative vehicle at our discretion.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold mb-3 text-primary">7. Communication &amp; Privacy</h2>
                <p className="text-muted-foreground mb-2">
                  By providing your email address and/or mobile number, you consent to us contacting you regarding your booking.
                </p>
                <p className="text-muted-foreground">
                  We will never share your contact details with third parties.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold mb-3 text-primary">8. Variations to Bookings</h2>
                <p className="text-muted-foreground mb-2">
                  Any changes to the agreed journey, including additional mileage, waiting time, or route changes, will be charged in accordance with our pricing structure.
                </p>
                <p className="text-muted-foreground mb-2">
                  We reserve the right to change your vehicle or chauffeur if necessary.
                </p>
                <p className="text-muted-foreground">
                  Our chauffeurs will select the most appropriate route on the day unless the client specifies otherwise at the time of booking.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold mb-3 text-primary">9. Parking, Tolls &amp; Penalties</h2>
                <p className="text-muted-foreground mb-2">
                  Parking fees, tolls, and other charges incurred during the hire will be added to the final cost.
                </p>
                <p className="text-muted-foreground">
                  If a parking ticket is issued due to client instruction, the full cost plus a £15 administration fee will be charged to the client.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold mb-3 text-primary">10. Insurance</h2>
                <p className="text-muted-foreground mb-2">
                  All vehicles (including subcontracted vehicles) are fully insured for passenger and third-party claims.
                </p>
                <p className="text-muted-foreground">
                  Customer property is carried entirely at the owner's risk.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold mb-3 text-primary">11. Right to Refuse Carriage</h2>
                <p className="text-muted-foreground mb-2">
                  We reserve the right to refuse service to any passenger who is, or appears to be:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mb-2">
                  <li>Under the influence of alcohol or drugs</li>
                  <li>Behaving in a threatening or unsafe manner</li>
                </ul>
                <p className="text-muted-foreground">
                  No refund will be issued in these circumstances.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold mb-3 text-primary">12. Public Holidays &amp; Special Dates</h2>
                <p className="text-muted-foreground mb-2">
                  Online quotations do not include surcharges for public holidays such as Christmas Day or New Year's Eve.
                </p>
                <p className="text-muted-foreground">
                  Please indicate on the booking form if your journey falls on a special date.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold mb-3 text-primary">13. Luggage</h2>
                <p className="text-muted-foreground mb-2">Standard luggage allowance:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>1 suitcase (approx. 80 × 45 × 25 cm, 15–20 kg)</li>
                  <li>1 piece of hand luggage (approx. 55 × 40 × 20 cm, 6–8 kg)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold mb-3 text-primary">14. Fare Calculation</h2>
                <p className="text-muted-foreground mb-2">Fares are calculated based on:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mb-2">
                  <li>Distance</li>
                  <li>Travel time</li>
                  <li>Number of passengers</li>
                  <li>Vehicle type</li>
                </ul>
                <p className="text-muted-foreground">
                  Fares may increase if the journey takes longer than expected due to traffic, weather, or other delays.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold mb-3 text-primary">15. Payment, Cancellations &amp; Refunds</h2>
                
                <h3 className="text-lg font-semibold mb-2 text-foreground">Payment</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mb-4">
                  <li>Payment can be made by cash, card, or BACS</li>
                  <li>Card payments can be made in-vehicle or online</li>
                  <li>No card fees are charged</li>
                  <li>Travel in Supreme Style is not VAT-registered; VAT receipts cannot be provided</li>
                  <li>All bookings must be paid in full at the time of booking or at least 48 hours before travel unless a corporate account arrangement exists</li>
                </ul>

                <h3 className="text-lg font-semibold mb-2 text-foreground">Cancellation Charges</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mb-4">
                  <li>Less than 48 hours' notice: 25% of total hire charge</li>
                  <li>Less than 24 hours' notice: 50% of total hire charge</li>
                  <li>Less than 12 hours' notice: 100% of total hire charge</li>
                  <li>No charge applies if the date/time is changed more than 24 hours before the original pickup time</li>
                </ul>

                <h3 className="text-lg font-semibold mb-2 text-foreground">Waiting Time</h3>
                <p className="text-muted-foreground mb-1 font-medium">Airport pickups:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mb-2">
                  <li>The first 45 minutes after actual landing time are free</li>
                  <li>After this, waiting time is charged at £15 per 30 minutes (pro rata)</li>
                </ul>
                <p className="text-muted-foreground mb-1 font-medium">Non-airport pickups:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mb-2">
                  <li>The first 30 minutes are free</li>
                  <li>After this, waiting time is charged at £15 per 30 minutes (pro rata)</li>
                </ul>
                <p className="text-muted-foreground mb-2">
                  If we cannot reach the passenger within the waiting period, the booking will be treated as a no-show and no refund will be issued.
                </p>
                <p className="text-muted-foreground">
                  Passengers experiencing delays (immigration, baggage, customs, etc.) must contact us immediately to avoid no-show charges.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold mb-3 text-primary">16. Copyright</h2>
                <p className="text-muted-foreground mb-2">
                  All website content is the property of Travel in Supreme Style Limited.
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>You may print or download extracts for personal, non-commercial use</li>
                  <li>You may share content with third parties only if the website is acknowledged as the source</li>
                  <li>No content may be reproduced, stored, or transmitted without written permission</li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground pt-6 border-t border-border">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
