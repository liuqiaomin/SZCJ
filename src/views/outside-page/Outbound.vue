<template>
  <div class="home-box">
    <el-form :inline="true" :model="searchForm" v-show="showSearch">
      <el-form-item label="搜索类型" prop="Regional_barcode ">
        <el-select v-model="searchForm.field" clearable placeholder="选择搜索类型">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="搜索的内容" v-if="searchForm.field">
        <el-input v-model="searchForm.content" placeholder="请输入要搜索的内容" class="handle-input mr10" clearable></el-input>
      </el-form-item>
      <el-form-item label="搜索时间" prop="Search_Date_time">
        <el-date-picker v-model="searchForm.Search_Date_time" type="datetimerange" :shortcuts="shortcuts"
          format="YYYY/MM/DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="remoteMethod" style="margin-left: -16px">查询搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="czz">
          <el-icon>
            <HelpFilled />
          </el-icon>重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" :model="searchForm" v-show="showSearch">
      <div style="padding: 15px">
        <el-form-item label="选择日期">
          <el-date-picker v-model="searchForm.time" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item>
          <el-button type="warning" :icon="Plus" @click="outexxx">导出表格</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-card>
      <el-table :data="tableData" show-summary v-loading="loading" element-loading-text="加载中..." border>
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
        <el-table-column prop="product_quantity" label="出售数量" align="center" width="120">
        </el-table-column>

        <el-table-column prop="product_specification" label="规格" align="center" width="190">
        </el-table-column>
        <el-table-column prop="product_unit" label="单位" align="center" width="120">
        </el-table-column>
        <el-table-column prop="total_price" label="总价" align="center" width="100">
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

const Search_Date_time = ref('')

const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 3)
      return [start, end]
    },
  },
]

// 查询操作
const options = [
  {
    value: "product_name",
    label: "商品名",
  }
];
const remoteMethod = async () => {
  if (searchForm.value.field) {
    loading.value = true;
    tableData.value = [];
    let in_data = {
      Type: "Search_Date",
      Table: "orders",
      condition_name1: searchForm.value.field,
      condition1: searchForm.value.content,
      Search_Date_time: JSON.stringify(searchForm.value.Search_Date_time),
      page: searchForm.value.page,
      page_size: searchForm.value.page_size
    };
    await api(in_data)
      .then((res) => {
        loading.value = false;
        if (res.status.error_msg == "success") {
          tableData.value = res.bizobj;
          total.value = res.count;
        } else {
          ElMessage.error("无数据！");
        }
      })
      .catch((err) => {
        loading.value = false;
      });
  }
};


//数据源
const searchForm = ref({
  id: 0,
  time: "",
  page: 1,
  page_size: 20,
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);

onMounted(() => {
  getListData();
});
const getListData = async () => {
  if (searchForm.value.field) {
    remoteMethod();
    return
  }
  loading.value = true;
  let in_data = {
    Type: "Jsearch",
    Table: "orders",
    ORDER_nane: "created_time",
    ORDER_da: "desc",
    page: searchForm.value.page,
    page_size: searchForm.value.page_size,
    condition_name1: "state",
    condition1: 0,
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
  if (searchForm.value.time) {
    loading.value = true;
    let p = {
      time: searchForm.value.time,
    };
    await Outbound_api(p)
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
const czz = () => {
  searchForm.value.page = 1;
  searchForm.value.page_size = 10;
  searchForm.value.Search_Date_time = '';
  searchForm.value.field = ""; //搜索字段
  searchForm.value.content = ""; //搜索内容
  searchForm.value.content2 = ""; //搜索内容
  getListData();
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
