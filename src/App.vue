
<script setup lang="ts">
  import DiaryTable from './components/DiaryTable.vue';
  import axios from 'axios';
  import { ref, onMounted , Ref, computed} from 'vue';
  import { JajanDetail, GroupedJajanDetail } from './interfaces';
  import { Modal } from 'bootstrap';
  import useFormat from './composable/useFormat';

  const { dateFormat, rupiah } = useFormat();

  const items: Ref<JajanDetail[]> = ref([] as JajanDetail[]);
  const entryName: Ref<string> = ref('');
  const entryPrice: Ref<number | string> = ref('');
  const modalRef: Ref<Element | undefined> = ref();
  const isSubmitted: Ref<boolean> = ref(false);

  let modalObj: Modal;

  const groupedItems = computed(() => {
    return items.value?.reduce((acc, curr) => {
      const dateIndex = acc?.findIndex(item => item.tanggal === curr.tanggal);
      if (dateIndex < 0) {
        const newItem = {
          tanggal: curr.tanggal,
          data: [
            curr,
          ],
        }
        return [...acc, newItem];
      }
      acc[dateIndex] = {
        ...acc[dateIndex],
        data: [
          ...acc[dateIndex].data,
          curr,
        ]
      }
      return [...acc];
      // expected => [{ tanggal: 1 jan, data: JajanDetail[] }]
    }, [] as GroupedJajanDetail[])?.sort((a, b) => {
      return new Date(b.tanggal).valueOf() - new Date(a.tanggal).valueOf();
    });
  });

  const totalSpendingMonthly = computed(() => {
    return items.value?.reduce((acc, curr) => curr.pengeluaraan + acc, 0);
  });

  const showModal = () => {
    modalObj?.show();
  }
  const closeModal = () => {
    entryName.value = '';
    entryPrice.value = '';
    isSubmitted.value = false;
    modalObj?.hide();
  }

  const getDataApi = () => {
    axios.get('http://localhost:3000/detail')
      .then(res => {
        items.value = res?.data;
      })
      .catch(error => console.log(error));
  }

  const submit = () => {
    isSubmitted.value = true;
    const now = new Date();
    const params = {
      nama: entryName.value,
      pengeluaraan: entryPrice.value,
      jam: dateFormat(now, 'HH:mm'),
      tanggal: dateFormat(now, 'DD MMMM YYYY')
    }
    if (entryName.value && entryPrice.value) {
      axios.post(
        'http://localhost:3000/detail',
        { ...params }
      )
        .then(res => {
          closeModal();
          getDataApi();
        });
    }
  }

  onMounted(() => {
    modalObj = new Modal(modalRef.value!);
    modalRef.value?.addEventListener('hidden.bs.modal', (e: any) => {
      closeModal();
    })

    getDataApi();
  });

</script>

<template>
  <div class="container py-5">
    <div class="text-center mb-4">
      <h4>
        Diari Jajan Februari 2021
      </h4>
      <p>
        Pengeluaran Bulan Ini
        {{ rupiah(totalSpendingMonthly) }}
      </p>
      <button class="btn btn-primary" @click="showModal">
        Tambah Item
      </button>
    </div>
    <div class="row">
      <div class="col-12 col-md-3" v-for="(item, idx) in groupedItems" :key="item.tanggal">
        <DiaryTable :detail="item" />
      </div>
    </div>
  </div>

  <div class="modal fade" id="entryModal" tabindex="-1" aria-labelledby="entryModalLabel" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header border-bottom-0">
          <h1 class="modal-title fs-5">Tambah Entri</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="form-group mb-3">
            <label for="entryName" class="form-label">
              Nama Jajanan
            </label>
            <input name="entryName" type="text" :class="`${isSubmitted && !entryName && 'is-invalid'} form-control`" v-model="entryName" />
            <p class="invalid-feedback">
              Harap Mengisi Nama Jajanan
            </p>
          </div>
          <div class="form-group">
            <label for="entryPrice" class="form-label">
              Harga
            </label>
            <div class="input-group">
              <div class="input-group-text">
                Rp
              </div>
              <input name="entryPrice" type="number" :class="`${isSubmitted && !entryPrice && 'is-invalid'} form-control`" v-model="entryPrice" />
            </div>
            <p :class="`${isSubmitted && !entryPrice && 'd-block'} invalid-feedback`" v-show="true">
              Harap Mengisi Harga Jajanan
            </p>
          </div>
        </div>
        <div class="modal-footer border-top-0">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">BATAL</button>
          <button type="button" class="btn btn-primary" @click="submit">KIRIM</button>
        </div>
      </div>
    </div>
  </div>
</template>
