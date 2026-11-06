<template>
  <div class="home-box">
    <el-form :inline="true" :model="searchForm" v-show="showSearch">
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
        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
        <el-table-column prop="username" label="账号" width="130" align="center">
        </el-table-column>
        <el-table-column
          prop="Permission_name"
          label="pc端权限"
          width="500"
          align="center"
        >
        </el-table-column>
        <el-table-column label="角色" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="danger">{{ row.role_name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_time" label="操作时间" width="200" align="center">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作"
          align="center"
          width="280"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="xq(row)">查看编辑 </el-button>
            <el-button type="danger" plain @click="onRemoveClick(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 查看编辑 -->
      <el-dialog v-model="dialogVisible" title="查看编辑" width="60%">
        <el-form label-position="top"
          ><el-form-item label="账号" prop="username">
            <el-input v-model="searchForm.username" placeholder="自定义"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="searchForm.password" placeholder="自定义"></el-input>
          </el-form-item>
          <el-form-item label="角色名" prop="role_name">
            <el-input v-model="searchForm.role_name" placeholder="如： 管理员"></el-input>
          </el-form-item>
          <el-divider />
          <el-form-item label="pc端权限设置" prop="Permission_s">
            <el-checkbox-group v-model="Permission_s">
              <el-checkbox
                :label="item.name"
                name="type"
                v-for="item in Permission_x"
                :key="item.name"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-divider />
          <el-form-item label="手机端权限权限设置" prop="Permission_s">
            <el-row :gutter="2">
              <div v-for="item in searchForm.elements" :key="item.name">
                <el-col :span="20"
                  ><div class="grid-content ep-bg-purple" />
                  {{ item.title }} <el-switch v-model="item.XY"
                /></el-col>
              </div>
            </el-row>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cz">取消</el-button>
            <el-button type="primary" @click="up">保存更新 </el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 新增 -->
      <el-dialog v-model="add_dialogVisible" title="新增账号" width="30%">
        <el-form label-position="top"
          ><el-form-item label="账号" prop="username">
            <el-input v-model="searchForm.username" placeholder="自定义"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="searchForm.password" placeholder="自定义"></el-input>
          </el-form-item>
          <el-form-item label="角色名" prop="role_name">
            <el-input
              v-model="searchForm.role_name"
              placeholder="如： 管理员"
            ></el-input> </el-form-item
        ></el-form>
        <el-form-item label="权限设置" prop="Permission_s">
          <el-checkbox-group v-model="Permission_s">
            <el-checkbox
              :label="item.name"
              name="type"
              v-for="item in Permission_x"
              :key="item.name"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-divider />
        <el-form-item label="手机端权限权限设置" prop="Permission_s">
          <el-row :gutter="2">
            <div v-for="item in searchForm.elements" :key="item.name">
              <el-col :span="20"
                ><div class="grid-content ep-bg-purple" />
                {{ item.title }} <el-switch v-model="item.XY"
              /></el-col>
            </div>
          </el-row>
        </el-form-item>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cz">取消</el-button>
            <el-button type="primary" @click="add">新建 </el-button>
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
import { ref, onMounted, watch, reactive } from "vue";
import { api, getPermission } from "@/api/api";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { switchServerUrl } from "@/utils/index";

const store = useStore();
const router = useRouter();

const showSearch = ref(true);

//数据源
const searchForm = reactive({
  id: "",
  username: "",
  role_name: "",
  password: "",
  Permission: [],
  Permission_name: "",
  page: 1,
  page_size: 20,
  elements: [],
});
const cz = () => {
  Object.assign(searchForm, {
    id: "",
    username: "",
    role_name: "",
    password: "",
    Permission: [],
    elements: [],
    page: 1,
    page_size: 20,
    Permission_name: "",
  });
  get_Permission();
  add_dialogVisible.value = false;
  dialogVisible.value = false;
  Permission_s.value = [];
};
const tableData = ref([]);
const Permission_x = ref([]); //权限列表
const Permission_s = ref([]); //选中权限列表
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);

onMounted(() => {
  getListData();
  get_Permission();
});
const get_Permission = () => {
  getPermission().then((data) => {
    console.log(data)
    Permission_x.value = data.bizobj;
    searchForm.elements = data.elements;
    // 使用forEach方法遍历数组，并将每个对象的XY字段设置为false
    searchForm.elements.forEach((obj) => {
      obj.XY = false;
    });

    // 输出修改后的数组
    console.log(array);
  });
};
/**
 * 获取账号列表
 */
const getListData = async () => {
  cz();
  loading.value = true;
  let in_data = {
    Type: "get",
    Table: "adminList",
    page: searchForm.page,
    page_size: searchForm.page_size,
  };
  await api(in_data)
    .then((res) => {
      console.log(res);
      if (res.status.error_msg == "success") {
        setTimeout(() => {
          tableData.value = res.bizobj;
          total.value = Number(res.page_info.total_items);
          loading.value = false;
          ElMessage.success("查询成功");
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
/**
 * 删除按钮点击事件
 */
const onRemoveClick = async (row) => {
  if (row.username === "admin") {
    ElMessage.error("管理员账户不能删除！");
    return;
  }

  const confirmResult = await ElMessageBox.confirm(
    "确定要删除【" + row.role_name + "】这个账号吗",
    {
      type: "warning",
    }
  ).catch((err) => {
    console.error(err);
  });

  if (confirmResult) {
    const requestData = {
      id: row.id,
      Table: "adminList",
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

const searchEvent = () => {
  searchForm.page = 1;
  getListData();
};

//查看账号
const dialogVisible = ref(false);
const xq = async (row) => {
  searchForm.id = row.id;
  searchForm.username = row.username;
  searchForm.role_name = row.role_name;
  searchForm.password = row.password;
  searchForm.elements = JSON.parse(row.elements);
  dialogVisible.value = true;
};
//更新账号
const up = async () => {
  if (searchForm.id == "1") {
    ElMessage.error("管理员账户不能更新！");
    return;
  }
  const aa = Permission_x.value;
  const bb = Permission_s.value;
  searchForm.Permission_name = bb.join("/");
  for (const i of bb) {
    searchForm.Permission.push(aa.find((item) => item.name === i));
  }
  const in_data = {
    Type: "adminList_up",
    Table: "adminList",
    id: searchForm.id,
    username: searchForm.username,
    role_name: searchForm.role_name,
    password: searchForm.password,
    Permission: searchForm.Permission,
    Permission_name: searchForm.Permission_name,
    elements: searchForm.elements,
  };
  await api(in_data)
    .then((res) => {
      console.log(res);
      if (res.status.error_msg == "success") {
        ElMessage.success("更新成功");
        getListData();
      } else {
        ElMessage.error("更新失败！");
      }
      dialogVisible.value = false;
    })
    .catch((err) => {
      loading.value = false;
    });
};

//新增账号
const add_dialogVisible = ref(false);

const add = async () => {
  const aa = Permission_x.value;
  const bb = Permission_s.value;
  searchForm.Permission_name = bb.join("/");
  for (const i of bb) {
    searchForm.Permission.push(aa.find((item) => item.name === i));
  }
  console.log(searchForm);
  const in_data = {
    Type: "adminList_add",
    Table: "adminList",
    username: searchForm.username,
    role_name: searchForm.role_name,
    password: searchForm.password,
    Permission: searchForm.Permission,
    Permission_name: searchForm.Permission_name,
    elements: searchForm.elements,
  };
  await api(in_data)
    .then((res) => {
      console.log(res);
      if (res.status.error_msg == "success") {
        ElMessage.success("新建成功");
        getListData();
      } else {
        ElMessage.error("新建失败！");
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
    border-radius: 50%;
  }
}
</style>
