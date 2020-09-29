
<template>
  <!-- 表头信息 -->
  <el-dialog :title="title" :visible.sync="visible" @close="clearHeadId" width="1400px">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          :disabled="flag"
          @click="submitForm"
          v-hasPermi="['container:head:clear']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="flag"
          @click="submitwaybillForm"
          v-hasPermi="['container:head:add']"
        >暂存</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-thumb"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['container:info:remove']"
        >申报</el-button>
      </el-col>-->
    </el-row>
    <!-- 提运单表头 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" size="mini">
      <el-row>
        <el-col :span="6">
          <el-form-item label="数据中心统一编号" prop="dataId">
            <el-input v-model="form.dataId" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="车次确认编号" prop="tripsNumber">
            <el-input v-model="form.tripsNumber" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关卡代码" prop="customscode">
            <el-input v-model="form.customscode" placeholder="请输入关卡代码" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单证状态" prop="documentStatus">
            <el-input v-model="form.documentStatus" placeholder="未暂存" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <!-- <el-form-item label="录入时间" prop="crtime">
            <el-input v-model="form.crtime" placeholder="系统反填" disabled />
          </el-form-item>-->

          <el-form-item label="录入时间">
            <el-date-picker
              v-model="form.crtime"
              type="datetime"
              placeholder="系统反填"
              disabled
              style="width:100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="统一社会引用代码" prop="centralizedCode">
            <el-input v-model="form.customscode" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="组织机构代码" prop="orgCode">
            <el-input v-model="form.supvloctcode" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="操作人员" prop="operator">
            <el-input v-model="form.operator" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="申报数据类型">
            <el-select
              v-model="form.declaredatatype"
              placeholder="请选择申报数据类型"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in declaredatatypeOptions"
                :key="dict.dictLabel"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="作业场所编号" prop="supvloctcode">
            <el-input v-model="form.supvloctcode" placeholder="请输入作业场所编号" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="业务类型">
            <el-select v-model="form.businessType" placeholder="请选择业务类型">
              <el-option
                v-for="dict in businessTypeOptions"
                :key="dict.dictLabel"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="报文发送时间" prop="decldate">
            <el-date-picker
              clearable
              style="width: 100%"
              v-model="form.decldate"
              type="datetime"
              value-format="timestamp"
              placeholder="选择时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 提运单body列表 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="clearBody"
          v-hasPermi="['container:body:clear']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="flag"
          @click="submitBodyForm"
          v-hasPermi="['container:body:add']"
        >暂存</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="flag ||multiple"
          @click="handleDelete"
          v-hasPermi="['container:body:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-upload"
          size="mini"
          :disabled="flag"
          @click="importClick"
          v-hasPermi="['container:body:import']"
        >导入</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        :data="bodyList"
        @selection-change="handleSelectionChange"
        @cell-dblclick="doubleClick"
        height="260px"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column label="集装箱号" align="center" prop="contaid" />
        <el-table-column label="集装箱尺寸" align="center" prop="contatypecode" />
        <el-table-column label="箱位代码" align="center" prop="seat" />
        <el-table-column label="拼箱状态" align="center" prop="contamark" :formatter="contamarkFormat" />
        <el-table-column label="装载状态" align="center" prop="loadmark" :formatter="loadmarkFormat" />
        <el-table-column label="当前状态" align="center" prop="workmark" :formatter="workmarkFormat" />
        <el-table-column label="备注" align="center" prop="containerF" />
      </el-table>
      <!-- row-dblclick   当某一行被双击时会触发该事件-->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-row>
    <!-- 提运单表体 -->
    <div style="margin:25px">
    <el-form ref="bodyForm" :model="bodyform" :rules="bodyRules" label-width="100px" size="mini">
      <el-row>
        <el-col :span="6">
          <el-form-item label="集装箱号" prop="contaid">
            <el-input v-model="bodyform.contaid" placeholder="请输入集装箱号" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="集装箱尺寸" prop="contatypecode">
            <el-select v-model="bodyform.contatypecode" placeholder="请选择集装箱尺寸">
              <el-option
                v-for="dict in contaSizeOptions"
                :key="dict.dictLabel"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="箱位代码" prop="seat">
            <el-input v-model="bodyform.seat" placeholder="请输入箱位代码" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="内外贸标识" prop="trademark">
            <el-select v-model="bodyform.trademark" placeholder="请选择内外贸标识">
              <el-option
                v-for="dict in tradeOptions"
                :key="dict.dictLabel"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="进出口标识" prop="ieflag">
            <el-select v-model="bodyform.ieflag" placeholder="请选择进出口标识">
              <el-option
                v-for="dict in importExitOptions"
                :key="dict.dictLabel"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="拼箱状态">
            <el-select v-model="bodyform.contamark" placeholder="请选择拼箱状态">
              <el-option
                v-for="dict in contaMarkOptions"
                :key="dict.dictLabel"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="装载状态">
            <el-select v-model="bodyform.loadmark" placeholder="请选择装载状态">
              <el-option
                v-for="dict in loadMarkOptions"
                :key="dict.dictLabel"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="危品柜状态">
            <el-select v-model="bodyform.dangermark" placeholder="请选择危品柜状态">
              <el-option
                v-for="dict in dangerMarkOptions"
                :key="dict.dictLabel"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="进场时间" prop="entrancedate">
            <el-date-picker
              clearable
              size="mini"
              v-model="bodyform.entrancedate"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出场时间" prop="departturedate">
            <el-date-picker
              clearable
              size="mini"
              v-model="bodyform.departturedate"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="当前状态">
            <el-select v-model="bodyform.workmark" placeholder="请选择当前状态">
              <el-option
                v-for="dict in workMarkOptions"
                :key="dict.dictLabel"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="数据处理标识">
            <el-select v-model="bodyform.datadealflag" placeholder="请选择数据处理标识">
              <el-option
                v-for="dict in dataFlagOptions"
                :key="dict.dictLabel"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="提单号" prop="billno">
            <el-input v-model="bodyform.billno" placeholder="请输入提单号" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="报关单号" prop="entryid">
            <el-input v-model="bodyform.entryid" placeholder="请输入报关单号" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="转关单号" prop="preno">
            <el-input v-model="bodyform.preno" placeholder="请输入转关单号" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="多式联运单号" prop="mtapplyblno">
            <el-input v-model="bodyform.mtapplyblno" placeholder="请输入多式联运单号" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="bodyform.remark" placeholder="请输入备注信息" />
        </el-form-item>
      </el-row>
    </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
    </div>

    <!-- 上传按钮对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?headId=' + this.headId"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import {
  listBody,
  getBody,
  addBody,
  updateBody,
  delBody,
  importTemplate,
  init
} from "@/api/container/import";
import { getInfo, addInfo, updateInfo, delInfo } from "@/api/container/info";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      // 遮罩层
      visible: false,
      // 选中数组值
      tables: [],
      // 标题
      title: "",
      // 总条数
      total: 0,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 表数据
      bodyList: [],
      // 选中数组
      ids: [],
      //申报数据类型
      declaredatatypeOptions: [],
      //进出口标志
      importExitOptions: [],
      //装载
      loadMarkOptions: [],
      //业务类型
      businessTypeOptions: [],
      // 内外贸标识
      tradeOptions: [],
      // 集装箱尺寸
      contaSizeOptions: [],
      // 数据处理
      dataFlagOptions: [],
      // 拼箱状态
      contaMarkOptions: [],
      // 当前状态
      workMarkOptions: [],
      // 危品柜状态
      dangerMarkOptions: [],
      // 表头id
      headId: undefined,
      // 表单参数
      form: {},

      bodyform: {},
      // 表头表单校验
      rules: {},
      // 表体表单校验
      bodyRules: {
        entrancedate: [
          { required: true, message: "请选择时间", trigger: "blur" }
        ]
      },
      //
      submitwaybllForm: undefined,

      flag: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        headId: undefined,
        tableName: undefined,
        tableComment: undefined
      },

      // // 上传文件
      upload: {
        // 是否显示弹出层（）
        open: false,
        // 弹出层标题（）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 上传参数
        headId: undefined,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/container/info/body/importData"
      }
    };
  },
  created() {
    //业务类型
    this.getDicts("station_business_type").then(response => {
      this.businessTypeOptions = response.data;
    });
    //申报数据类
    this.getDicts("station_declare_type").then(response => {
      this.declaredatatypeOptions = response.data;
    });
    // 进出口标识
    this.getDicts("station_IE_flag").then(response => {
      this.importExitOptions = response.data;
    });
    // 装载状态
    this.getDicts("station_load_mark").then(response => {
      this.loadMarkOptions = response.data;
    });
    // 危品柜状态
    this.getDicts("station_danger_mark").then(response => {
      this.dangerMarkOptions = response.data;
    });
    // 拼箱状态
    this.getDicts("station_conta_mark").then(response => {
      this.contaMarkOptions = response.data;
    });
    // 内外贸标识
    this.getDicts("station_trade_mark").then(response => {
      this.tradeOptions = response.data;
    });
    // 集装箱尺寸
    this.getDicts("station_conta_size").then(response => {
      this.contaSizeOptions = response.data;
    });
    // 数据处理
    this.getDicts("station_data_flag").then(response => {
      this.dataFlagOptions = response.data;
    });
    //当前状态
    this.getDicts("station_work_mark").then(response => {
      this.workMarkOptions = response.data;
    });
  },
  methods: {
    /** 查询提运单表体列表 */
    getList() {
      this.queryParams.headId = this.headId;
      listBody(this.queryParams).then(res => {
        if (res.code === 200) {
          this.bodyList = res.rows;
          this.total = res.total;
        }
      });
    },
    getRowKeys(row) {
      return row.id;
    },

    /** 页面数据初始化 */
    initialization() {
      init().then(res => {
        this.form = res.data;
        this.headId = this.form.id;
      });
    },
    // 弹框关闭
    clearHeadId() {
      this.headId = undefined;
    },
    /** 取消按钮 */
    cancel() {
      console.log("我执行了");
      this.visible = false;
      this.headId = undefined;
    },
    // 显示弹框
    show() {
      this.visible = true;
      // this.clearBody();
      // this.clearHead();
      if (this.headId) {
        getInfo(this.headId).then(response => {
          this.form = response.data;
        });
        this.getList();
      } else {
        this.initialization();
      }
      // this.getlistData();
    },

    initSelect() {},
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    //拼箱状态翻译
    contamarkFormat(row, column) {
      return this.selectDictLabel(this.contaMarkOptions, row.contamark);
    },
    // 装载状态翻译
    loadmarkFormat(row, column) {
      return this.selectDictLabel(this.loadMarkOptions, row.loadmark);
    },
    // 当前状态翻译
    workmarkFormat(row, column) {
      return this.selectDictLabel(this.workMarkOptions, row.workmark);
    },
    /** 表头提交按钮 */
    submitForm: function() {
      this.clearHead();
      this.clearBody();
      this.initialization();
      this.bodyList = [];
    },
    submitwaybillForm: function() {
      this.documentStatus = "0";
      this.$refs["form"].validate(valid => {
        if (valid) {
          addInfo(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess(response.msg);
              this.open = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },

    /** 表体提交按钮 */
    submitBodyForm: function() {
      this.$refs["bodyForm"].validate(valid => {
        if (valid) {
          if (this.bodyform.id != undefined) {
            updateBody(this.bodyform).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.clearBody();
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else if (this.headId != undefined) {
            this.bodyform.headId = this.headId;
            addBody(this.bodyform).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.clearBody();
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            this.msgError("请先填写表头信息");
          }
        }
      });
    },
    // 重置表体信息
    clearBody() {
      this.bodyform = {
        id: undefined,
        contaid: undefined,
        contatypecode: undefined,
        seat: undefined,
        trademark: undefined,
        ieflag: undefined,
        contamark: undefined,
        loadmark: undefined,
        dangermark: undefined,
        entrancedate: undefined,
        departturedate: undefined,
        workmark: undefined,
        datadealflag: undefined,
        billno: undefined,
        entryid: undefined,
        preno: undefined,
        mtapplyblno: undefined,
        remark: undefined
      };
    },
    clearHead() {
      this.form = {
        id: undefined,
        headId: undefined,
        dataId: undefined,
        tripsNumber: undefined,
        customs: undefined,
        documentStatus: "0",
        entryTime: undefined,
        centralizedCode: undefined,
        orgCode: undefined,
        operator: undefined,
        customscode: undefined,
        supvloctcode: undefined,
        decldate: undefined,
        declaredatatype: undefined,
        totalmsgno: undefined,
        curmsgno: undefined,
        receiptdecldate: undefined,
        result: undefined,
        remark: undefined
      };
    },

    clearheadId() {
      this.form = {
        id: undefined,
        headId: undefined
      };
    },
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm("是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delBody(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    doubleClick(row, column, cell, event) {
      if (row.id != undefined) {
        getBody(row.id).then(res => {
          if (res.code === 200) {
            this.bodyform = res.data;
          }
        });
      }
    },

    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", {
        dangerouslyUseHTMLString: true
      });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      if (this.headId) {
        this.upload.headId = this.headId;
        this.$refs.upload.submit();
      } else {
        this.msgError("请先保存申报基础信息");
        this.upload.open = false;
      }
    },
    /** 导入按钮 */
    importClick() {
      this.upload.title = "集装箱信息导入";
      this.upload.open = true;
    }
  }
};
</script>

<style lang="css" scoped>
.el-select {
  width: 100%;
}
</style>
