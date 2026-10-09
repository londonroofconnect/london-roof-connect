export default function RooferPage() {
  const field = {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    border: "1px solid #ccd6e0",
    borderRadius: "9px",
    fontSize: "16px"
  };

  return (
    <main style={{ fontFamily: "Arial, sans-serif", color: "#102a43", margin: 0 }}>
      <header style={{
        background: "#0b1f33",
        color: "white",
        padding: "20px"
      }}>
        <div style={{
          maxWidth: "1000px",
          margin: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <a href="/" style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "22px"
          }}>
            London Roof Connect
          </a>

          <a href="/" style={{
            color: "#0b1f33",
            background: "#f4b942",
            padding: "10px 14px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold"
          }}>
            Home
          </a>
        </div>
      </header>

      <section style={{
        background: "#0b1f33",
        color: "white",
        padding: "70px 20px"
      }}>
        <div style={{ maxWidth: "1000px", margin: "auto" }}>
          <p style={{ fontWeight: "bold" }}>
            Roofing Jobs. Real People. London.
          </p>

          <h1 style={{
            fontSize: "clamp(40px, 8vw, 68px)",
            lineHeight: 1.05,
            maxWidth: "800px"
          }}>
            Find roofing jobs across London
          </h1>

          <p style={{
            fontSize: "19px",
            lineHeight: 1.6,
            maxWidth: "700px"
          }}>
            Register your interest and tell us which areas you cover.
            We’ll use that information to match you with suitable roofing enquiries.
          </p>
        </div>
      </section>

      <section style={{
        maxWidth: "1000px",
        margin: "auto",
        padding: "50px 20px"
      }}>
        <h2 style={{ fontSize: "30px" }}>Why join?</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "18px"
        }}>
          <div>
            <h3>Local leads</h3>
            <p>Focus on homeowners looking for roofing work across London.</p>
          </div>

          <div>
            <h3>Simple process</h3>
            <p>Tell us the areas and types of roofing work you cover.</p>
          </div>

          <div>
            <h3>Grow your workload</h3>
            <p>Get access to more roofing opportunities as the platform grows.</p>
          </div>
        </div>
      </section>

      <section style={{
        background: "#f4f7fa",
        padding: "55px 20px"
      }}>
        <div style={{ maxWidth: "700px", margin: "auto" }}>
          <h2 style={{ fontSize: "32px" }}>Register as a roofer</h2>

          <p>Fill in your details below.</p>

          <form
            action="mailto:info@londonroofconnect.com"
            method="post"
            encType="text/plain"
            style={{ display: "grid", gap: "13px" }}
          >
            <input
              name="Name"
              required
              placeholder="Your name"
              style={field}
            />

            <input
              name="Company"
              placeholder="Company name"
              style={field}
            />

            <input
              name="Phone"
              required
              type="tel"
              placeholder="Phone number"
              style={field}
            />

            <input
              name="Email"
              required
              type="email"
              placeholder="Email address"
              style={field}
            />

            <input
              name="Areas covered"
              required
              placeholder="Areas you cover e.g. Croydon, Bromley"
              style={field}
            />

            <textarea
              name="Services"
              rows="5"
              placeholder="What roofing work do you cover?"
              style={field}
            />

            <button
              type="submit"
              style={{
                background: "#0b1f33",
                color: "white",
                border: 0,
                padding: "16px",
                borderRadius: "9px",
                fontSize: "17px",
                fontWeight: "bold"
              }}
            >
              Register Interest
            </button>
          </form>
        </div>
      </section>

      <footer style={{
        background: "#0b1f33",
        color: "white",
        textAlign: "center",
        padding: "28px"
      }}>
        <strong>London Roof Connect</strong>
        <br />
        Roofing Jobs. Real People. London.
      </footer>
    </main>
  );
}