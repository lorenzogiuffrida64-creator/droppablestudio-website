export default function WhyLedger() {
  return (
    <section className="why" id="why">
      <div className="wrap">
        <div className="why-head">
          <h2 className="rv d1">
            Traditional production is <em>obsolete.</em>
          </h2>
        </div>

        <div className="ledger">
          <div className="row rv">
            <span className="tag">Budget</span>
            <p className="claim">
              <s>Crew, studio, models, reshoots.</s> One AI campaign costs less
              than one day on a traditional set.
            </p>
            <div className="metric">
              <b>−60%</b>
              <span>typical production cost</span>
            </div>
          </div>
          <div className="row rv">
            <span className="tag">Speed</span>
            <p className="claim">
              <s>Months of pre-production.</s> From brief to final cut in days
              — launch while the trend is still alive.
            </p>
            <div className="metric">
              <b>72h</b>
              <span>concept to delivery</span>
            </div>
          </div>
          <div className="row rv">
            <span className="tag">Re-hook</span>
            <p className="claim">
              <s>One ad, one shot at attention.</s> We regenerate endless hook
              variations from a single master — and re-capture the feed until
              it converts.
            </p>
            <div className="metric">
              <b>∞</b>
              <span>hook variations</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
