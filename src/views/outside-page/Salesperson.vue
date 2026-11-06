<template>
  <div class="home-box">
    <el-card>
      <el-form :inline="true" :model="searchForm" v-show="showSearch">
        <div style="padding: 15px">
          <el-form-item label="选择业务员" prop="company_name">
            <el-select
              v-model="searchForm.Customer_Name"
              filterable
              remote
              reserve-keyword
              placeholder="输入业务员名称 如 SZCJ马"
              :remote-method="customers_remoteMethod"
              style="width: 240px"
              clearable
              @change="handleSelectChange"
            >
              <el-option
                v-for="item in customersoptions"
                :key="item.id"
                :label="item.username"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择日期" v-if="searchForm.Customer_id">
            <el-date-picker
              v-model="searchForm.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="timehandleSelectChange"
            />
          </el-form-item>
          <el-form-item v-if="searchForm.time">
            <el-button type="warning" :icon="Plus" @click="outexxx">导出表格</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <el-card>
      <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="加载中..."
        border
      >
        <el-table-column
          fixed="left"
          prop="created_by"
          label="开单人"
          align="center"
          width="150"
        >
        </el-table-column>
        <el-table-column prop="customer_name" label="客户名" align="center" width="220">
        </el-table-column>
        <el-table-column prop="customer_level" label="客户等级" align="center" width="90">
        </el-table-column>
        <el-table-column prop="customer_phone" label="客户电话" align="center" width="90">
        </el-table-column>
        <el-table-column
          prop="customer_address"
          label="客户地址"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column prop="is_paid" label="是否付款" align="center" width="120">
        </el-table-column>

        <el-table-column prop="delivery_person" label="配送员" align="center" width="190">
        </el-table-column>
        <el-table-column prop="order_total_price" label="总价" align="center" width="100">
        </el-table-column>
        <el-table-column prop="created_time" label="开单时间" align="center" width="170">
        </el-table-column>
        <el-table-column prop="rob_time" label="抢单时间" align="center" width="170">
        </el-table-column>
        <el-table-column prop="reach_time" label="送达时间" align="center" width="170">
        </el-table-column>
        <el-table-column label="交付图" align="center" width="95">
          <template #default="{ row }">
            <el-image
              class="avatar"
              :src="row.receipt_photo"
              :z-index="10"
              :preview-src-list="[row.receipt_photo]"
              preview-teleported
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="88" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" plain @click="onShowClick(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="searchForm.page"
        v-model:limit="searchForm.page_size"
        @pagination="getListData"
      />
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, reactive } from "vue";
import { api, Salesperson_api } from "@/api/api";
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
  page_size: 20,

  Customer_Name: "", //业务员
  Customer_id: "",
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);

onMounted(() => {});
//业务员搜索
const customersoptions = ref([]); //搜索结果

const customers_remoteMethod = async (query) => {
  if (query) {
    loading.value = true;
    let in_data = {
      Type: "search",
      Table: "adminList",
      condition_name1: "username",
      condition1: query,
    };
    await api(in_data)
      .then((res) => {
        loading.value = false;
        if (res.status.error_msg == "success") {
          customersoptions.value = res.bizobj;
        } else {
          ElMessage.error("无数据！");
        }
      })
      .catch((err) => {
        loading.value = false;
      });
  }
};
//业务员选择
const handleSelectChange = (selectedItem) => {
  if (selectedItem) {
    console.log(selectedItem);
    searchForm.value.Customer_Name = selectedItem.username;
    searchForm.value.Customer_id = selectedItem.id;
    getListData();
  } else {
    searchForm.value.Customer_Name = "";
    customersoptions.value = "";
    searchForm.value.time = "";
  }
};

//时间选择
const timehandleSelectChange = (selectedItem) => {
  console.log(selectedItem);
  getListData();
};

const getListData = async () => {
  loading.value = true;
  let in_data = {
    Type: "Jsearch_time",
    Table: "order_list",
    page: searchForm.value.page,
    page_size: searchForm.value.page_size,
    time: searchForm.value.time,
    created_by_id: searchForm.value.Customer_id,
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
const outexxx = async () => {
  console.log(searchForm.value.time);
  if (searchForm.value.time) {
    loading.value = true;
    let p = {
      time: searchForm.value.time,
      created_by_id: searchForm.value.Customer_id,
    };
    await Salesperson_api(p)
      .then((res) => {
        loading.value = false;
        if (res.status.error_code == 0) {
          ElMessage.success(res.status.error_msg);
          window.location.replace(res.bizobj);
        } else {
          ElMessage.error(res.status.error_msg);
        }
      })
      .catch((err) => {
        loading.value = false;
      });
  } else {
    ElMessage.error("请输入时间！");
  }
};
/**
 * 查看按钮点击事件
 */
const onShowClick = (row) => {
  let i = {
    id: row.id,
  };
  router.push({
    path: "/Billing/Billing_xq",
    query: i,
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
