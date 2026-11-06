<template>
  <div class="home-box">
    <el-form :inline="true" :model="searchForm" v-show="showSearch">
      <el-form-item>
        <el-button type="warning" :icon="Plus" @click="openAdd">
          新增
        </el-button>
      </el-form-item>
    </el-form>

    <el-card>
      <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="加载中..."
        border
      >
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="username" label="账号" width="130" align="center" />
        <el-table-column prop="Permission_name" label="pc端权限" width="500" align="center" />
        <el-table-column label="角色" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="danger">{{ row.role_name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_time" label="操作时间" width="200" align="center" />
        <el-table-column label="操作" align="center" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="xq(row)">
              查看编辑
            </el-button>
            <el-button type="danger" plain @click="onRemoveClick(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 查看编辑 -->
      <el-dialog v-model="dialogVisible" title="查看编辑" width="30%">
        <el-form label-position="top">
          <el-form-item label="账号">
            <el-input v-model="searchForm.username" placeholder="自定义" />
          </el-form-item>

          <el-form-item label="密码">
            <el-input v-model="searchForm.password" placeholder="自定义" />
          </el-form-item>

          <el-form-item label="角色名">
            <el-input v-model="searchForm.role_name" placeholder="如：管理员" />
          </el-form-item>

          <el-divider />

          <el-form-item label="pc端权限设置">
            <el-checkbox-group v-model="Permission_s">
              <el-checkbox
                v-for="item in Permission_x"
                :key="item.name"
                :label="item.name"
              />
            </el-checkbox-group>
          </el-form-item>

          <el-divider />

          <el-form-item label="手机端权限设置">
            <el-row :gutter="2">
              <div v-for="item in searchForm.elements" :key="item.name">
                <el-col :span="20">
                  {{ item.title }}
                  <el-switch v-model="item.XY" />
                </el-col>
              </div>
            </el-row>
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="cz">取消</el-button>
          <el-button type="primary" @click="up">保存更新</el-button>
        </template>
      </el-dialog>

      <!-- 新增 -->
      <el-dialog v-model="add_dialogVisible" title="新增账号" width="30%">
        <el-form label-position="top">
          <el-form-item label="账号">
            <el-input v-model="searchForm.username" placeholder="自定义" />
          </el-form-item>

          <el-form-item label="密码">
            <el-input v-model="searchForm.password" placeholder="自定义" />
          </el-form-item>

          <el-form-item label="角色名">
            <el-input v-model="searchForm.role_name" placeholder="如：管理员" />
          </el-form-item>

          <el-form-item label="权限设置">
            <el-checkbox-group v-model="Permission_s">
              <el-checkbox
                v-for="item in Permission_x"
                :key="item.name"
                :label="item.name"
              />
            </el-checkbox-group>
          </el-form-item>

          <el-divider />

          <el-form-item label="手机端权限设置">
            <el-row :gutter="2">
              <div v-for="item in searchForm.elements" :key="item.name">
                <el-col :span="20">
                  {{ item.title }}
                  <el-switch v-model="item.XY" />
                </el-col>
              </div>
            </el-row>
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="cz">取消</el-button>
          <el-button type="primary" @click="add">新建</el-button>
        </template>
      </el-dialog>

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

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { api, getPermission } from '@/api/api'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// ===================== 类型 =====================
interface PermissionItem {
  name: string
  [key: string]: any
}

interface TableRow {
  id: number | string
  username: string
  password?: string
  role_name: string
  Permission_name: string
  elements: string
  [key: string]: any
}

// ===================== 状态 =====================
const showSearch = ref(true)
const loading = ref(false)
const dialogVisible = ref(false)
const add_dialogVisible = ref(false)

const tableData = ref<any[]>([])
const total = ref(0)

const Permission_x = ref<PermissionItem[]>([])
const Permission_s = ref<string[]>([])

const searchForm = reactive({
  id: '',
  username: '',
  role_name: '',
  password: '',
  Permission: [] as PermissionItem[],
  Permission_name: '',
  page: 1,
  page_size: 20,
  elements: [] as any[]
})

// ===================== 初始化 =====================
onMounted(() => {
  getListData()
  get_Permission()
})

// ===================== 权限列表 =====================
const get_Permission = async () => {
  const data = await getPermission()
  Permission_x.value = data.bizobj || []

  searchForm.elements = (data.elements || []).map((item: any) => ({
    ...item,
    XY: false
  }))
}

// ===================== 列表 =====================
const getListData = async () => {
  loading.value = true
  try {
    const res = await api({
      Type: 'get',
      Table: 'adminList',
      page: searchForm.page,
      page_size: searchForm.page_size
    })

    if (res.status.error_msg === 'success') {
      tableData.value = res.data
      total.value = Number(res.page_info.total_items)
    } else {
      ElMessage.error('查询失败')
    }
  } finally {
    loading.value = false
  }
}

// ===================== 重置 =====================
const cz = () => {
  searchForm.id = ''
  searchForm.username = ''
  searchForm.role_name = ''
  searchForm.password = ''
  searchForm.Permission = []
  searchForm.Permission_name = ''
  searchForm.elements = Permission_x.value.map(() => ({
    XY: false
  }))

  Permission_s.value = []
  dialogVisible.value = false
  add_dialogVisible.value = false
}

// ===================== 编辑回显（✅ 核心修复） =====================
const xq = (row: TableRow) => {
  searchForm.id = row.id
  searchForm.username = row.username
  searchForm.role_name = row.role_name
  searchForm.password = row.password

  searchForm.elements = JSON.parse(row.elements || '[]').map((item: any) => ({
    ...item,
    XY: !!item.XY
  }))

  // ✅ PC 端权限回显
  Permission_s.value = row.Permission_name
    ? row.Permission_name.split('/').filter(Boolean)
    : []

  dialogVisible.value = true
}

// ===================== 删除 =====================
const onRemoveClick = async (row: TableRow) => {
  if (row.username === 'admin') {
    ElMessage.error('管理员账户不能删除')
    return
  }

  const confirm = await ElMessageBox.confirm(
    `确定删除【${row.role_name}】吗？`,
    '警告',
    { type: 'warning' }
  )

  if (confirm) {
    const res = await api({
      Type: 'delete',
      Table: 'adminList',
      id: row.id
    })

    if (res.status.error_msg === 'success') {
      ElMessage.success('删除成功')
      getListData()
    } else {
      ElMessage.error('删除失败')
    }
  }
}

// ===================== 构建权限数据 =====================
const buildPermissionData = () => {
  searchForm.Permission = []
  Permission_s.value.forEach((name) => {
    const item = Permission_x.value.find(p => p.name === name)
    if (item) {
      searchForm.Permission.push(item)
    }
  })
  searchForm.Permission_name = Permission_s.value.join('/')
}

// ===================== 更新 =====================
const up = async () => {
  if (searchForm.id === '1') {
    ElMessage.error('管理员账户不能更新')
    return
  }

  buildPermissionData()

  const res = await api({
    Type: 'adminList_up',
    Table: 'adminList',
    id: searchForm.id,
    username: searchForm.username,
    role_name: searchForm.role_name,
    password: searchForm.password,
    Permission: searchForm.Permission,
    Permission_name: searchForm.Permission_name,
    elements: searchForm.elements
  })

  if (res.status.error_msg === 'success') {
    ElMessage.success('更新成功')
    dialogVisible.value = false
    getListData()
  } else {
    ElMessage.error('更新失败')
  }
}

// ===================== 新增 =====================
const openAdd = () => {
  cz()
  add_dialogVisible.value = true
}

const add = async () => {
  buildPermissionData()

  const res = await api({
    Type: 'adminList_add',
    Table: 'adminList',
    username: searchForm.username,
    role_name: searchForm.role_name,
    password: searchForm.password,
    Permission: searchForm.Permission,
    Permission_name: searchForm.Permission_name,
    elements: searchForm.elements
  })

  if (res.status.error_msg === 'success') {
    ElMessage.success('新建成功')
    add_dialogVisible.value = false
    getListData()
  } else {
    ElMessage.error('新建失败')
  }
}
</script>

<style lang="scss" scoped>
.home-box {
  .header {
    margin-bottom: 22px;
    text-align: right;
  }
}
</style>