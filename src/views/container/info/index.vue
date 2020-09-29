<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <!-- <el-form-item label="作业场所编号" prop="supvloctcode">
        <el-input
          v-model="queryParams.supvloctcode"
          placeholder="请输入作业场所编号"
          clearable
          si
          e="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->

      <el-form-item label="处理结果" prop="result">
        <el-select v-model="queryParams.result" placeholder="请选择状态">
          <el-option
            v-for="dict in resultOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
       <el-form-item label="是否自动申报" prop="mediumInfo">
       <el-checkbox ></el-checkbox>
       </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-thumb"
          size="mini"
          :disabled="multiple"
          @click="animals"
          v-hasPermi="['container:query:declare']"
        >申报</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="openAddDialog"
          v-hasPermi="['animals:query:add']"
        >手动新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          v-hasPermi="['animals:query:add']"
        >自动新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />

      <!-- <el-table-column label="报文编码" align="center" prop="msgid" />
      <el-table-column label="报文类型" align="center" prop="msgtype" /> -->
      <el-table-column label="关卡代码" align="center" prop="customscode" />
      <el-table-column label="作业场所编号" align="center" prop="supvloctcode" />
      <el-table-column label="录入时间" align="center" prop="crtime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.crtime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报文回执时间" align="center" prop="receiptdecldate">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.receiptdecldate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理结果" align="center" prop="result" :formatter="resultFormat"/>
      <el-table-column label="回执备注" align="center" prop="remark" />

      <!-- <el-table-column label="创建时间" align="center" prop="crtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.crtime) }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleEdit(scope.row)"
            v-hasPermi="['container:head:query']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['container:head:query']"
          >修改</el-button>
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

    <!-- 添加或修改集装箱头对话框 -->
    <import-table ref="import" @ok="handleQuery" />
  </div>
</template>

<script>
import {
  listInfo,
  getInfo,
  delInfo,
  addInfo,
  updateInfo,
  exportInfo
} from "@/api/container/info";
import importTable from "./importTable";
export default {
  components: { importTable },
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
      // 集装箱头表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 回执结果(处理结果)
      resultOptions:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        msgid: undefined,
        msgtype: undefined,
        customscode: undefined,
        supvloctcode: undefined,
        decldate: undefined,
        declaredatatype: undefined,
        totalmsgno: undefined,
        curmsgno: undefined,
        status: undefined,
        receiptdecldate: undefined,
        result: undefined,
        version: undefined,
        crtime: undefined,
        cruser: undefined,
        crusername: undefined,
        del: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        msgid: [
          { required: true, message: "报文编码不能为空", trigger: "blur" }
        ],
        msgtype: [
          {
            required: true,
            message: "报文类型'csa01'不能为空",
            trigger: "blur"
          }
        ],
        customscode: [
          { required: true, message: "关卡代码不能为空", trigger: "blur" }
        ],
        supvloctcode: [
          { required: true, message: "作业场所编号不能为空", trigger: "blur" }
        ],
        decldate: [
          { required: true, message: "报文发送时间不能为空", trigger: "blur" }
        ],
        declaredatatype: [
          { required: true, message: "申报数据类型0不能为空", trigger: "blur" }
        ],
        totalmsgno: [
          {
            required: true,
            message: "申报数据报文总数1不能为空",
            trigger: "blur"
          }
        ],
        curmsgno: [
          { required: true, message: "当前报文序号1不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "申报状态0不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    // 回执结果
     this.getDicts("station_declear_status").then(response => {
      this.resultOptions = response.data;
    });
  },
  methods: {
    /** 查询集装箱头列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 回执结果翻译
    resultFormat(row, column) {
      return this.selectDictLabel(this.resultOptions, row.result);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        msgid: undefined,
        msgtype: undefined,
        customscode: undefined,
        supvloctcode: undefined,
        decldate: undefined,
        declaredatatype: undefined,
        totalmsgno: undefined,
        curmsgno: undefined,
        status: "0",
        receiptdecldate: undefined,
        result: undefined,
        remark: undefined,
        version: undefined,
        crtime: undefined,
        cruser: undefined,
        crusername: undefined,
        del: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加集装箱头";
    },
    // /** 修改按钮操作 */
    // handleUpdate(row) {
    //   this.reset();
    //   const id = row.id || this.ids;
    //   getInfo(id).then(response => {
    //     this.form = response.data;
    //     this.open = true;
    //     this.title = "修改集装箱头";
    //   });
    // },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除集装箱头编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delInfo(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 详细按钮操作 */
    handleEdit(row) {
      const ids = row.id || this.ids;
      this.$refs.import.title = "集装箱详情";
      this.$refs.import.headId = ids;
      this.$refs.import.flag = true;
      this.$refs.import.show();
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      this.$refs.import.title = "修改集装箱申报";
      this.$refs.import.headId = id;
      this.$refs.import.flag = false;
      this.$refs.import.show();
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有集装箱头数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportInfo(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },

    /** 申报按钮操作 */
    animals(row) {
      const ids = row.id || this.ids;
      this.$confirm("是否确认申报所有集装箱头数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
        
      })
      
        .then(function() {

          return delInfo(ids);
          
        })
        .then(() => {
          this.getList();
          this.msgSuccess("申报成功");
        })
        .catch(function() {});
    },

    /** 打开新增弹窗 */
    openAddDialog() {
      this.$refs.import.title = "集装箱申报";
      this.$refs.import.flag = false;
      this.$refs.import.show();
    }
  }
};
</script>