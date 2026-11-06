<template>
  <div class="home-box">
    <el-form :inline="true" :model="searchForm" v-show="showSearch">
      <el-form-item label="公司条码" prop="Regional_barcode ">
        <el-input-number
          v-model="searchForm.Regional_barcode"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="公司">
        <el-input v-model="searchForm.account" placeholder="公司" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchEvent" style="margin-left: -16px"
          >查询
        </el-button></el-form-item
      >
      <el-form-item>
        <el-button type="warning" :icon="Plus" @click="add_dialogVisible = true"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <el-card>
      <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="加载中..."
        border
      >
        <el-table-column prop="id" label="公司ID" align="center" width="120">
        </el-table-column>
        <el-table-column prop="company_name" label="公司名称" align="center" width="200">
        </el-table-column>
        <el-table-column prop="phone" label="公司电话" align="center" width="100">
        </el-table-column>
        <el-table-column prop="wechat" label="微信" align="center" width="100">
        </el-table-column>
        <el-table-column prop="address" label="地址" align="center" width="180">
        </el-table-column>
        <el-table-column prop="created_time" label="创建时间" align="center" width="180">
        </el-table-column>
        <el-table-column label="活动操作" width="208" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" plain @click="onRemoveClick(row)">删除</el-button>
            <el-button plain @click="up_bu(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增 -->
      <el-dialog v-model="add_dialogVisible" title="新增" width="30%">
        <el-form label-position="top"
          ><el-form-item label="名称" prop="company_name">
            <el-input
              v-model="searchForm.company_name"
              placeholder="请输入名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="searchForm.phone" placeholder="请输入电话"></el-input>
          </el-form-item>
          <el-form-item label="微信" prop="wechat">
            <el-input v-model="searchForm.wechat" placeholder="请输入微信"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input
              v-model="searchForm.address"
              placeholder="请输入地址"
            ></el-input> </el-form-item
        ></el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="add_dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="add">新建 </el-button>
          </span>
        </template>
      </el-dialog>
      <!-- 编辑 -->
      <el-dialog v-model="up_dialogVisible" title="编辑" width="30%">
        <el-form label-position="top"
          ><el-form-item label="公司名称" prop="customer_name">
            <el-input
              v-model="searchForm.company_name"
              placeholder="请输入名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="公司电话" prop="phone">
            <el-input v-model="searchForm.phone" placeholder="请输入电话"></el-input>
          </el-form-item>
          <el-form-item label="公司微信" prop="wechat">
            <el-input v-model="searchForm.wechat" placeholder="请输入微信"></el-input>
          </el-form-item>
          <el-form-item label="公司地址" prop="address">
            <el-input v-model="searchForm.address" placeholder="请输入地址"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="up_dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="up">更新</el-button>
          </span>
        </template>
      </el-dialog>
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
import { ref, onMounted, reactive } from "vue";
import { api } from "@/api/api";
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
  company_name: "",
  phone: "",
  wechat: "",
  address: "",
  page: 1,
  page_size: 30,
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);

//重置
const resetting = async () => {
  searchForm.value = {
    id: 0,
    company_name: "",
    phone: "",
    wechat: "",
    address: "",
    page: 1,
    page_size: 10,
  };
};
onMounted(() => {
  getListData();
});
/**
 * 获取公司列表
 */
const getListData = async () => {
  loading.value = true;
  let in_data = {
    Type: "get",
    Table: "suppliers",
    page: searchForm.value.page,
    page_size: searchForm.value.page_size,
  };
  await api(in_data)
    .then((res) => {
      console.log(res);
      if (res.status.error_msg == "success") {
        setTimeout(() => {
          tableData.value = res.bizobj;
          total.value = Number(res.page_info.total_items);
          loading.value = false;
        }, 1000);
      } else {
        ElMessage.error("查询失败！");
      }
      loading.value = false;
      r;
    })
    .catch((err) => {
      loading.value = false;
    });
};

//新增账号
const add_dialogVisible = ref(false);
const add = async () => {
  let ii = searchForm.value;
  const in_data = {
    Type: "suppliers_add",
    Table: "suppliers",
    company_name: ii.company_name,
    phone: ii.phone,
    wechat: ii.wechat,
    address: ii.address,
  };
  console.log(in_data);
  await api(in_data)
    .then((res) => {
      console.log(res);
      if (res.status.error_msg == "success") {
        ElMessage.success("新建成功");
        add_dialogVisible.value = false;
        getListData();
        resetting();
      } else {
        ElMessage.error("新建失败！");
      }
    })
    .catch((err) => {});
};

/**
 * 删除按钮点击事件
 */
const onRemoveClick = async (row) => {
  const confirmResult = await ElMessageBox.confirm(
    "确定要删除【" + row.company_name + "】这个公司吗",
    {
      type: "warning",
    }
  ).catch((err) => {
    console.error(err);
  });

  if (confirmResult) {
    const requestData = {
      id: row.id,
      Table: "suppliers",
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
//编辑账号
const up_dialogVisible = ref(false);
const up_bu = (row) => {
  searchForm.value.company_name = row.company_name;
  searchForm.value.phone = row.phone;
  searchForm.value.wechat = row.wechat;
  searchForm.value.address = row.address;
  searchForm.value.id = row.id;
  up_dialogVisible.value = true;
  console.log(searchForm.value);
};

const up = async () => {
  let ii = searchForm.value;
  const in_data = {
     Type: "suppliers_up",
    Table: "suppliers",
    company_name: ii.company_name,
    phone: ii.phone,
    wechat: ii.wechat,
    address: ii.address,
    id: ii.id,
  };
  loading.value = true;
  await api(in_data)
    .then((res) => {
      console.log(res);
      if (res.status.error_msg == "success") {
        ElMessage.success("更新成功");
        up_dialogVisible.value = false;
        loading.value = false;
        getListData();
      } else {
        ElMessage.error("更新失败！");
      }
    })
    .catch((err) => {});
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
