<template>
  <div class="home-box">
    <el-form :inline="true" :model="searchForm" v-show="showSearch">
      <el-form-item>
        <el-button type="warning" :icon="Plus" @click="add_LiSt">新增</el-button>
      </el-form-item>
    </el-form>
    <el-card>
      <el-form :inline="true" :model="searchForm" v-show="showSearch">
        <el-form-item label="搜索的商品名">
          <el-input v-model="searchForm.content" placeholder="请输入要搜索的商品名" class="handle-input mr10"
            clearable></el-input>
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
    </el-card>
    <el-card>
      <el-table :data="tableData" v-loading="loading" element-loading-text="加载中..." border>
        <el-table-column prop="creator" label="创建人" align="center" width="102">
        </el-table-column>
        <el-table-column prop="state" label="审核状态" fixed="left" align="center" width="90">
        </el-table-column>

        <el-table-column prop="supplier" label="供应商" align="center" width="200">
        </el-table-column>
        <el-table-column prop="supplier_id" label="供应商ID" align="center" width="120">
        </el-table-column>
        <el-table-column prop="product_name" label="商品名" align="center" width="120">
        </el-table-column>
        <el-table-column prop="product_id" label="商品ID" align="center" width="120">
        </el-table-column>
        <el-table-column label="商品图" align="center" width="95">
          <template #default="{ row }">
            <el-image class="avatar" :src="row.product_image" :z-index="10" :preview-src-list="[row.product_image]"
              preview-teleported>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="product_category" label="商品分类" align="center" width="100">
        </el-table-column>
        <el-table-column prop="specification" label="规格" align="center" width="180">
        </el-table-column>
        <el-table-column prop="specification_number" label="规格数" align="center" width="180">
        </el-table-column>
        <el-table-column prop="unit_price" label="入库单价" align="center" width="100">
        </el-table-column>
        <el-table-column prop="quantity" label="入库数量" align="center" width="180">
        </el-table-column>
        <el-table-column prop="total" label="金额" align="center" width="100">
        </el-table-column>
        <el-table-column prop="created_time" label="创建时间" align="center" width="170">
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
import { api } from "@/api/api";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { switchServerUrl } from "@/utils/index";



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


const store = useStore();
const router = useRouter();

const showSearch = ref(true);

//数据源
const searchForm = ref({
  id: 0,
  Regional_barcode: "",
  role: "",
  date: "",

  page: 1,
  page_size: 10,


  Search_Date_time: '',
  field: "", //搜索字段
  content: "", //搜索内容
  content2: "", //搜索内容
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);

onMounted(() => {
  getListData();
});
// watch(
//   () => router.currentRoute.value,
//   () => {
//     getListData();
//   }
// );
/**
 * 获取商品列表
 */
const getListData = async () => {
  loading.value = true;
  let in_data = {
    Type: "get",
    Table: "warehouse_entry_application_form",
    page: searchForm.value.page,
    page_size: searchForm.value.page_size,
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
const add_LiSt = () => {
  router.push({
    path: "/warehouse/add",
    // query: row,
  });
};

/**
 * 删除按钮点击事件
 */
const onRemoveClick = async (row) => {
  const confirmResult = await ElMessageBox.confirm(
    "确定要删除【" + row.product_name + "】这个商品吗",
    {
      type: "warning",
    }
  ).catch((err) => {
    console.error(err);
  });

  if (confirmResult) {
    const requestData = {
      id: row.id,
      Table: "products",
      Type: "delete",
    };

    try {
      const response = await api(requestData);
      console.log(response);
      if (response.status.error_msg === "success") {
        ElMessage.success("删除成功");
        getListData();
      } else {
        ElMessage.error("删除失败！");
      }
    } catch (error) {
      console.error(error);
    }
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
const remoteMethod = async () => {
  if (searchForm.value.content) {
    loading.value = true;
    tableData.value = [];
    let in_data = {
      Type: "Search_Date",
      Table: "warehouse_entry_application_form",
      condition_name1: 'product_name',
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
