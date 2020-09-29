<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--通道数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="chnlId"
            placeholder="请输入通道名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="chnlOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!-- 通道基本信息 -->
      <el-col :span="20" :xs="24" v-if="show">
        <el-table :data="chnlConfigList" @selection-change="handleSelectionChange">
          <el-table-column label="通道名称" align="center" prop="cChnlName" />
          <el-table-column
            label="通道类型"
            align="center"
            prop="cChnlType"
            :formatter="chnlTypeFormat"
          />
          <el-table-column label="通道状态停用/启用" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <!--设备数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="设备状态" prop="equipmentStatus">
            <el-select
              v-model="queryParams.equipmentStatus"
              placeholder="设备状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="chnlList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="通道名称" align="center" prop="chnlName" />
          <el-table-column
            label="设备名称"
            align="center"
            prop="equipmentType"
            :formatter="equipmenFormat"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="设备地址"
            align="center"
            prop="equipmentAddr"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="设备参数" align="center" prop="equipmentParm" />
          <el-table-column
            label="设备状态"
            align="center"
            prop="equipmentStatus"
            :formatter="statusFormat"
          />
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                type="warning"
                icon="el-icon-warning"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['monitor:device:rstatr']"
              >重启</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  exportUser,
  resetUserPwd,
  changeUserStatus,
  importTemplate
} from "@/api/system/user";
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { chnllist, listEquipment, restart } from "@/api/monitoring/equipment";
import { getChnlConfig, changechnlStatus } from "@/api/monitoring/chnlConfig";
export default {
  name: "User",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      chnlList: null,
      // 弹出层标题
      title: "",
      // 显示通道信息
      show: false,
      // 通道信息
      chnlConfigList: [],
      // 通道树选项
      chnlOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 通道名称
      chnlId: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 设备状态数据字典
      statusOptions: [],
      // 性别状态字典
      equipmenOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 通道
      chnlForm: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equipmentStatus: undefined,
        chnlId: undefined
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "归属通道不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    // 根据名称筛选通道树
    chnlId(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getDicts("chnl_equipment_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("chnl_equipment_type").then(response => {
      this.equipmenOptions = response.data;
    });
  },
  methods: {
    /** 查询设备列表 */
    getList() {
      this.loading = true;
      listEquipment(this.queryParams).then(response => {
        this.chnlList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询通道下拉树结构 */
    getTreeselect() {
      chnllist().then(response => {
        this.chnlOptions = response.data;
      });
    },
    // 设备类型翻译
    equipmenFormat(row, column) {
      return this.selectDictLabel(this.equipmenOptions, row.equipmentType);
    },
    //设备状态
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.equipmentStatus);
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.chnlId = data.id;
      if (data.id) {
        this.getchnlinfo(data.id);
      } else {
        this.show = false;
      }
      this.getList();
    },
    // 通道信息
    getchnlinfo(id) {
      this.chnlConfigList = [];
      getChnlConfig(id).then(response => {
        if ((response.code = "200")) {
          this.show = true;
          var arr = [];
          arr.push(response.data);
          this.chnlConfigList = arr;
        }
      });
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.cChnlName + '"通道吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return changechnlStatus(row.id, row.status);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 删除按钮操作 */
    handleUpdate(row) {
      const equipmentid = row.id || this.ids;
      this.$confirm("是否确认重启设备", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return restart(equipmentid);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        })
        .catch(function() {});
    }
  }
};
</script>