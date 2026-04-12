<script setup>
import { ref } from 'vue'

const transactionInfo = ref('')
const zkpObject = ref('')
const actionNote = ref('')

function generateTransaction() {
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `tx-${Date.now()}`
  transactionInfo.value = JSON.stringify(
    {
      id,
      type: 'receipt',
      amount: '0.00',
      currency: 'USD',
      merchant: '',
      description: '',
      timestamp: new Date().toISOString(),
    },
    null,
    2,
  )
  actionNote.value = ''
}

function onSend() {
  actionNote.value = 'Send flow (connect to your backend when ready).'
}

function onReceive() {
  actionNote.value = 'Receive flow (connect to your backend when ready).'
}

function generateZkp() {
  zkpObject.value = JSON.stringify(
    {
      version: 1,
      scheme: 'groth16',
      circuitId: 'easyreceipt-receipt-v1',
      publicInputs: {
        nullifier: '0x0000000000000000000000000000000000000000000000000000000000000000',
        commitment: '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
      proof: {
        a: ['0x0…', '0x0…'],
        b: [['0x0…', '0x0…'], ['0x0…', '0x0…']],
        c: ['0x0…', '0x0…'],
      },
      note: 'Replace with a real proof from your prover.',
      createdAt: new Date().toISOString(),
    },
    null,
    2,
  )
}
</script>

<template>
  <section class="home">
    <button type="button" class="btn btn-primary" @click="generateTransaction">
      Generate transaction
    </button>

    <label class="field-label" for="tx-info">Transaction information</label>
    <textarea
      id="tx-info"
      v-model="transactionInfo"
      class="tx-textarea"
      rows="12"
      spellcheck="false"
      placeholder="Generated transaction JSON will appear here. You can edit it."
    />

    <div class="row-actions">
      <button type="button" class="btn btn-secondary" @click="onSend">Send</button>
      <button type="button" class="btn btn-secondary" @click="onReceive">Receive</button>
    </div>
    <p v-if="actionNote" class="action-note" role="status">{{ actionNote }}</p>

    <button type="button" class="btn btn-primary" @click="generateZkp">
      Generate ZKP
    </button>

    <p class="field-label zkp-label">Digital ZKP object</p>
    <pre class="zkp-box" tabindex="0">{{ zkpObject || '' }}</pre>
  </section>
</template>

<style scoped>
.home {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: 0 0 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-label {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0b1a3d;
}

.zkp-label {
  margin-top: 8px;
}

.tx-textarea {
  width: 100%;
  padding: 12px 14px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: #1a202c;
  background: #f7fafc;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  resize: vertical;
  min-height: 200px;
}

.tx-textarea:focus {
  outline: 2px solid #26b17d;
  outline-offset: 1px;
  border-color: #26b17d;
}

.row-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.btn {
  font: inherit;
  font-weight: 600;
  font-size: 0.9375rem;
  padding: 10px 20px;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.btn-primary {
  background: #26b17d;
  color: #fff;
}

.btn-primary:hover {
  background: #1f9a6c;
}

.btn-primary:focus-visible {
  outline: 2px solid #0b1a3d;
  outline-offset: 2px;
}

.btn-secondary {
  background: #fff;
  color: #0b1a3d;
  border-color: #0b1a3d;
}

.btn-secondary:hover {
  background: #0b1a3d;
  color: #fff;
}

.btn-secondary:focus-visible {
  outline: 2px solid #26b17d;
  outline-offset: 2px;
}

.action-note {
  margin: -4px 0 0;
  font-size: 0.8125rem;
  color: #4a5568;
}

.zkp-box {
  margin: 0;
  min-height: 160px;
  max-height: 320px;
  overflow: auto;
  padding: 14px 16px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
  line-height: 1.5;
  color: #1a202c;
  background: #edf2f7;
  border: 1px solid #a0aec0;
  border-radius: 8px;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-x: auto;
}
</style>
