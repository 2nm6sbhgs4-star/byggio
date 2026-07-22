import { useState } from 'react'
import type { CalculatorConfig, CalculatorVariant, Field, ResultRow } from './calculators'

function CalculatorForm({ fields, calculate, steps, stepIllustrations }: {
  fields: Field[]
  calculate: (v: Record<string, number>, raw: Record<string, string>) => ResultRow[]
  steps?: string[]
  stepIllustrations?: string[]
}) {
  const initial: Record<string, string> = {}
  fields.forEach((f) => { initial[f.key] = f.default ?? '' })
  const [values, setValues] = useState(initial)

  const numericValues: Record<string, number> = {}
  fields.forEach((f) => { numericValues[f.key] = parseFloat(values[f.key]) || 0 })

  const harResultat = fields
    .filter((f) => f.type !== 'select' && !f.default)
    .every((f) => numericValues[f.key] > 0)

  const results = harResultat ? calculate(numericValues, values) : []
  const totalPris = results.reduce((sum, r) => sum + (r.pricePerUnit ? r.quantity * r.pricePerUnit : 0), 0)
  const harPriser = results.some((r) => r.pricePerUnit)

  return (
    <>
      <div className="form-grid">
        {fields.map((f) => (
          <label key={f.key}>
            {f.label} {f.unit && `(${f.unit})`}
            {f.type === 'select' ? (
              <select
                value={values[f.key]}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              >
                {f.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                value={values[f.key]}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                placeholder="t.ex. 10"
              />
            )}
          </label>
        ))}
      </div>

      {harResultat && (
        <div className="result-box">
          <h3>Materialåtgång</h3>
          {results.map((r) => (
            <div className="result-row" key={r.label}>
              <span>{r.label}</span>
              <strong>{r.quantity.toFixed(r.decimals ?? 1)} {r.unit}</strong>
            </div>
          ))}
          <p className="disclaimer">
            Ungefärlig beräkning – kontrollera alltid mot konstruktionsritning eller kontakta en byggkonsult för exakta mängder.
          </p>
        </div>
      )}

      {harResultat && harPriser && (
        <div className="shopping-box">
          <h3>Inköpslista</h3>
          {results.filter((r) => r.pricePerUnit).map((r) => (
            <div className="result-row" key={r.label}>
              <span>{r.label} <span className="qty">({r.quantity.toFixed(r.decimals ?? 1)} {r.unit} à {r.pricePerUnit} kr)</span></span>
              <strong>{Math.round(r.quantity * (r.pricePerUnit ?? 0)).toLocaleString('sv-SE')} kr</strong>
            </div>
          ))}
          <div className="result-row total-row">
            <span>Totalt (material)</span>
            <strong>{Math.round(totalPris).toLocaleString('sv-SE')} kr</strong>
          </div>
          <p className="disclaimer">
            Priserna är ungefärliga schablonpriser och kan skilja sig från faktiska butikspriser. Arbetskostnad ingår ej.
          </p>
        </div>
      )}

      {steps && (
        <div className="guide-box">
          <h3>Så här går du tillväga</h3>
          <ol className="guide-list">
            {steps.map((step, i) => (
              <li key={i}>
                {stepIllustrations?.[i] && (
                  <div
                    className="step-illustration"
                    dangerouslySetInnerHTML={{ __html: stepIllustrations[i] }}
                  />
                )}
                {step}
              </li>
            ))}
          </ol>
          <p className="disclaimer">
            Generell vägledning – följ alltid tillverkarens anvisningar och lokala byggregler.
          </p>
        </div>
      )}
    </>
  )
}

function Calculator({ config }: { config: CalculatorConfig }) {
  const [variantKey, setVariantKey] = useState<string | null>(
    config.variants ? config.variants[0].key : null
  )

  const activeVariant: CalculatorVariant | null = config.variants
    ? config.variants.find((v) => v.key === variantKey) ?? config.variants[0]
    : null

  return (
    <div className="calculator">
      <h2>Beräkna material</h2>

      {config.variants && (
        <label className="variant-select">
          Typ av konstruktion
          <select value={variantKey ?? ''} onChange={(e) => setVariantKey(e.target.value)}>
            {config.variants.map((v) => (
              <option key={v.key} value={v.key}>{v.label}</option>
            ))}
          </select>
        </label>
      )}

      {activeVariant ? (
        <CalculatorForm
          key={activeVariant.key}
          fields={activeVariant.fields}
          calculate={activeVariant.calculate}
          steps={activeVariant.steps}
          stepIllustrations={activeVariant.stepIllustrations}
        />
      ) : (
        config.fields && config.calculate && (
          <CalculatorForm
            fields={config.fields}
            calculate={config.calculate}
            steps={config.steps}
            stepIllustrations={config.stepIllustrations}
          />
        )
      )}
    </div>
  )
}
export default Calculator