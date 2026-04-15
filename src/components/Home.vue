<script setup>
import { onMounted, ref } from 'vue'
import { requestTextHash } from '../api/hashApi.js'
import { requestEntries } from '../api/entriesApi.js'

const text = ref('')
const loading = ref(false)
const status = ref('')
const entries = ref([])
const entriesLoading = ref(false)

async function generateHashCode() {
  status.value = ''
  loading.value = true
  try {
    const { hash } = await requestTextHash(text.value)
    status.value = hash
    await refreshEntries()
  } catch (e) {
    const msg =
      e?.status === 404
        ? 'API not found (404). Is the backend running on port 3000?'
        : typeof e?.message === 'string' && e.message.startsWith('API error')
          ? e.message
          : 'Could not reach the server. Is the backend running?'
    status.value = msg
  } finally {
    loading.value = false
  }
}

function formatTimestamp(ms) {
  if (!ms) return ''
  try {
    return new Date(Number(ms)).toLocaleString()
  } catch {
    return String(ms)
  }
}

async function refreshEntries() {
  entriesLoading.value = true
  try {
    entries.value = await requestEntries()
  } catch {
    // Keep UI simple: ignore refresh errors here.
  } finally {
    entriesLoading.value = false
  }
}

onMounted(() => {
  refreshEntries()
})
</script>

<template>
  <section class="home">
    <label class="label" for="user-text">Enter some text</label>
    <textarea
      id="user-text"
      v-model="text"
      class="input"
      rows="8"
      spellcheck="true"
    />
    <button type="button" class="btn" :disabled="loading" @click="generateHashCode">
      {{ loading ? 'Please wait…' : 'Generate Hash Code' }}
    </button>
    <p v-if="status" class="status" role="status">{{ status }}</p>

    <div class="tableHeader">
      <h2 class="tableTitle">Saved entries</h2>
      <button type="button" class="btnSecondary" :disabled="entriesLoading" @click="refreshEntries">
        {{ entriesLoading ? 'Refreshing…' : 'Refresh' }}
      </button>
    </div>

    <div class="tableWrap" role="region" aria-label="Saved hash entries">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Row</th>
            <th>Timestamp</th>
            <th>Data</th>
            <th>Hash code</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="entries.length === 0">
            <td colspan="5" class="emptyCell">No entries yet</td>
          </tr>
          <tr v-for="row in entries" :key="row.id">
            <td class="mono">{{ row.id }}</td>
            <td class="num">{{ row.count }}</td>
            <td class="mono">{{ formatTimestamp(row.timestamp_ms) }}</td>
            <td class="mono dataCell">{{ row.text }}</td>
            <td class="mono">{{ row.hash }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.home {
  width: 100%;
  max-width: 920px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #0b1a3d;
}

.input {
  width: 100%;
  padding: 12px 14px;
  font: inherit;
  line-height: 1.45;
  color: #1a202c;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  resize: vertical;
  min-height: 140px;
}

.input:focus {
  outline: 2px solid #26b17d;
  outline-offset: 1px;
  border-color: #26b17d;
}

.btn {
  align-self: flex-start;
  font: inherit;
  font-weight: 600;
  padding: 10px 18px;
  color: #fff;
  background: #26b17d;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn:hover:not(:disabled) {
  background: #1f9a6c;
}

.btn:focus-visible {
  outline: 2px solid #0b1a3d;
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.status {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
  line-height: 1.5;
  word-break: break-all;
  color: #1a202c;
}

.tableHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
}

.tableTitle {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #0b1a3d;
}

.btnSecondary {
  font: inherit;
  font-weight: 600;
  padding: 8px 12px;
  color: #0b1a3d;
  background: #fff;
  border: 1px solid #0b1a3d;
  border-radius: 8px;
  cursor: pointer;
}

.btnSecondary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.tableWrap {
  border: 1px solid #cbd5e0;
  border-radius: 10px;
  overflow: auto;
  background: #fff;
}

.table {
  width: 100%;
  border-collapse: collapse;
  min-width: 860px;
}

.table th,
.table td {
  border-bottom: 1px solid #e2e8f0;
  padding: 10px 12px;
  text-align: left;
  vertical-align: top;
  font-size: 0.8125rem;
  color: #1a202c;
}

.table th {
  position: sticky;
  top: 0;
  background: #f7fafc;
  z-index: 1;
  font-weight: 700;
  color: #0b1a3d;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  word-break: break-all;
}

.num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  width: 72px;
}

.dataCell {
  max-width: 360px;
  white-space: pre-wrap;
}

.emptyCell {
  color: #4a5568;
  text-align: center;
}

@media (max-width: 640px) {
  .btn {
    width: 100%;
  }

  .tableTitle {
    font-size: 0.9rem;
  }

  .table {
    min-width: 680px;
  }

  .table th,
  .table td {
    padding: 9px 10px;
  }

  .dataCell {
    max-width: 220px;
  }
}
</style>