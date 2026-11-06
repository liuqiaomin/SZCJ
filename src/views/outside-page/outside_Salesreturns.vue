<template>
  <div class="home-box">
    <el-card>
      <el-table :data="tableData" v-loading="loading" element-loading-text="加载中..." border>
        <el-table-column prop="product_name" label="商品名" align="center" width="250">
        </el-table-column>
        <el-table-column prop="Receiptprice" label="入库价" align="center" width="90">
        </el-table-column>
        <el-table-column prop="totalcost" label="总成本" align="center" width="90">
        </el-table-column>
        <el-table-column prop="Totalprofit" label="总利润" align="center" width="90">
        </el-table-column>
        <el-table-column prop="level_price" label="单价" align="center" width="200">
        </el-table-column>
        <el-table-column prop="product_quantity" label="退货数量" align="center" width="120">
        </el-table-column>

        <el-table-column prop="product_specification" label="规格" align="center" width="190">
        </el-table-column>
        <el-table-column prop="product_unit" label="单位" align="center" width="120">
        </el-table-column>
        <el-table-column prop="created_time" label="下单时间" align="center" width="170">
        </el-table-column>
        <el-table-column prop="identifying" label="分店ID" align="center" width="170">
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination v-show="total > 0" :total="total" v-model:page="searchForm.page" v-model:limit="searchForm.page_size"
        @pagination="getListData" />
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, reactive } from "vue";
import { api, Outbound_api } from "@/api/api";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { switchServerUrl } from "@/utils/index";

const store = useStore();
const router = useRouter();

const showSearch = ref(true);

//数据源
const searchForm = ref({
  id: 0,
  time: "",
  page: 1,
  page_size: 100,
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);

onMounted(() => {
  getListData();
});
const getListData = async () => {
  loading.value = true;
  let in_data = {
    Type: "Jsearch",
    Table: "orders",
    ORDER_nane: "created_time",
    ORDER_da: "desc",
    page: searchForm.value.page,
    page_size: searchForm.value.page_size,
    condition_name1: "state",
    condition1: 1,
  };
  await api(in_data)
    .then((res) => {
      loading.value = false;
      if (res.status.error_msg == "success") {
        setTimeout(() => {
          tableData.value = res.bizobj;
          total.value = Number(res.page_info.total_items);
        }, 200);
      } else {
        options.value = [];
        searchForm.selectedValue = "";
        ElMessage.error("无数据！");
      }
    })
    .catch((err) => {
      loading.value = false;
    });
};

</script>

<style lang="scss" scoped>
.home-box {
  .header {
    margin-bottom: 22px;
    text-align: right;
  }

  ::v-deep .el-tag {
    margin-right: 6px;
  }

  ::v-deep .avatar {
    width: 60px;
    height: 60px;
    border-radius: 13%;
  }
}
</style>
