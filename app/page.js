export default function Home() {
  const box = {
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
          <strong style={{ fontSize: "22px" }}>London Roof Connect</strong>

          <a href="/roofer" style={{
            color: "#0b1f33",
            background: "#f4b942",
            padding: "10px 14px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold"
          }}>
            Roofer Area
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
            maxWidth: "750px"
          }}>
            Need a roofer in London?
          </h1>

          <p style={{
            fontSize: "19px",
            lineHeight: 1.6,
            maxWidth: "700px"
          }}>
            Tell us what roofing work you need and we’ll help connect you
            with roofers looking for jobs in your area.
          </p>

          <a href="#quote" style={{
            display: "inline-block",
            marginTop: "18px",
            background: "#f4b942",
            color: "#102a43",
            padding: "15px 20px",
            borderRadius: "9px",
            textDecoration: "none",
            fontWeight: "bold"
          }}>
            Get a Free Roofing Quote
          </a>
        </div>
      </section>

      <section style={{
        maxWidth: "1000px",
        margin: "auto",
        padding: "50px 20px"
      }}>
        <h2 style={{ fontSize: "30px" }}>How it works</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "18px"
        }}>
          <div>
            <h3>1. Tell us about the job</h3>
            <p>Send us the details of the roofing work you need.</p>
          </div>

          <div>
            <h3>2. We match your enquiry</h3>
            <p>Your roofing enquiry can be shared with suitable roofers.</p>
          </div>

          <div>
            <h3>3. Get contacted</h3>
            <p>Interested roofers can contact you about the job.</p>
          </div>
        </div>
      </section>

      <section id="quote" style={{
        background: "#f4f7fa",
        padding: "55px 20px"
      }}>
        <div style={{ maxWidth: "700px", margin: "auto" }}>
          <h2 style={{ fontSize: "32px" }}>Get a free roofing quote</h2>

          <p>Tell us what work you need.</p>

          <form
            action="mailto:info@londonroofconnect.com"
            method="post"
            encType="text/plain"
            style={{ display: "grid", gap: "13px" }}
          >
            <input name="Name" required placeholder="Your name" style={box} />

            <input
              name="Postcode"
              required
              placeholder="London postcode"
              style={box}
            />

            <input
              name="Phone"
              required
              type="tel"
              placeholder="Phone number"
              style={box}
            />

            <select name="Job type" style={box}>
              <option>Roof repair</option>
              <option>Roof leak</option>
              <option>New roof</option>
              <option>Flat roof</option>
              <option>Guttering</option>
              <option>Chimney work</option>
              <option>Other roofing work</option>
            </select>

            <textarea
              name="Job details"
              required
              rows="6"
              placeholder="Tell us about the roofing work you need"
              style={box}
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
              Send Roofing Enquiry
            </button>
          </form>
        </div>
      </section>

      <section style={{
        textAlign: "center",
        padding: "55px 20px"
      }}>
        <h2>Are you a London roofer?</h2>

        <p>Find homeowners looking for roofing work across London.</p>

        <a href="/roofer" style={{
          display: "inline-block",
          background: "#f4b942",
          color: "#102a43",
          padding: "14px 20px",
          borderRadius: "9px",
          textDecoration: "none",
          fontWeight: "bold"
        }}>
          Go to Roofer Area
        </a>
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