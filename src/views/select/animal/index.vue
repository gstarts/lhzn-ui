<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="车牌号码" prop="mediumInfo">
        <el-input
          v-model="queryParams.mediumInfo"
          placeholder="请输入车牌号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
       <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
       <!-- <el-form-item label="是否自动申报" prop="mediumInfo">
       <el-checkbox v-model="checked"></el-checkbox>
       </el-form-item> -->
     
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-thumb"
          size="mini"
          :disabled="multiple"
          @click="declare"
          v-hasPermi="['animals:query:declare']"
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
    </el-row> -->
    <el-table v-loading="loading" :data="animalsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="关卡代码" align="center" prop="customscode" />
      <el-table-column label="作业场所编号" align="center" prop="supvloctcode" />
      <el-table-column label="录入时间" align="center" prop="crtime">
       <template slot-scope="scope">
          <span>{{ parseTime(scope.row.crtime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报文回执时间" align="center" prop="recvdecldata" />
      <el-table-column label="处理结果" align="center" prop="result" :formatter="resultFormat"/>
      <el-table-column label="回执备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleEdit(scope.row)"
            v-hasPermi="['animals:declare:query']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['animals:declare:query']"
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

 <!-- 添加或修改动植物申报对话框 -->
    <import-table ref="import" @ok="handleQuery" />
  </div>
</template>

<script>
import {
  listAnimals,
  getAnimals,
  declareAnimals,
  addAnimals,
  updateAnimals,
  exportAnimals
} from "@/api/animal/animals";
import importTable from "../../animal/animals/importTable";
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
      // headid
      headId: undefined,
      // 动植物申报表格数据
      animalsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
       // 回执结果
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
        recvdecldata: undefined,
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
          {
            required: true,
            message:
              "报文编码(业务类型（2位）＋作业场所（场地）代码＋四位年＋两位月＋两位日＋两位小时（24小时制）＋两位分钟＋两位秒＋三位毫秒。业务类型默认值： 01高风险动植物及其产品数据。如申报数据需拆成多个报文发送时（每个报文不得大于4m），多个报文的msgid保持一致)不能为空",
            trigger: "blur"
          }
        ],
        msgtype: [
          { required: true, message: "报文类型csa03不能为空", trigger: "blur" }
        ],
        customscode: [
          {
            required: true,
            message: "关卡代码场所现场海关代码（4位代码）不能为空",
            trigger: "blur"
          }
        ],
        supvloctcode: [
          {
            required: true,
            message: "作业场所编号作业场所（场地）编码不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
     // 回执结果翻译
     this.getDicts("station_declear_status").then(response => {
      this.resultOptions = response.data;
    });
  },
  methods: {
     // 回执结果翻译
    resultFormat(row, column) {
      return this.selectDictLabel(this.resultOptions, row.result);
    },
    /** 查询动植物申报列表 */
    getList() {
      this.loading = true;
      listAnimals(this.queryParams).then(response => {
        this.animalsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
        recvdecldata: undefined,
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
      this.title = "添加动植物申报";
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateAnimals(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addAnimals(this.form).then(response => {
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
  
    /** 详细按钮操作 */
    handleEdit(row) {
      const ids = row.id || this.ids;
      this.$refs.import.title = "动植物申报详情";
      this.$refs.import.headId = ids;
      this.$refs.import.flag = true;
      this.$refs.import.show();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      this.$refs.import.title = "修改动植物申报";
      this.$refs.import.headId = id;
      this.$refs.import.flag = false;
      this.$refs.import.show();
    },
       /** 申报按钮操作 */
    declare(row) {
      const ids = row.id || this.ids;
      this.$confirm("是否确认申报所有动植物申报数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return declareAnimals(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("申报成功");
        })
        .catch(function() {});
    },
   
  }
};
</script>