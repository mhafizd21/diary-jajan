<script setup lang="ts">
  import { computed } from 'vue';
  import useFormat from '../composable/useFormat';
  import { GroupedJajanDetail } from '../interfaces';

  const props = defineProps<{ detail: GroupedJajanDetail}>();
  const { dateFormat, rupiah } = useFormat();

  const totalSpending = computed(() => {
    return rupiah(props?.detail?.data?.reduce((acc, curr) => curr.pengeluaraan + acc, 0));
  });
</script>

<template>
  <div class="card mb-4 h-100">
    <div class="card-body">
      <div class="border-bottom">
        <p class="card-title">{{ dateFormat(detail.tanggal) }}</p>
      </div>
      <table class="table">
        <tbody>
          <tr v-for="item in props.detail?.data" :key="`${item.jam}-${item.nama}-${item.pengeluaraan}`">
            <td>
              {{ item?.jam }}
            </td>
            <td>
              {{ item?.nama}}
            </td>
            <td class="text-end">
              {{ rupiah(item?.pengeluaraan) }}
            </td>
          </tr>
          <tr>
            <td colspan="2" class="text-end">
              Total
            </td>
            <td class="text-end">
              {{ totalSpending }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>