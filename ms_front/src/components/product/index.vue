<template>
  <div>
    <Row>
      <Col span="3"><Tree :data="data4" @on-select-change="onSelectChange"></Tree>
      <!-- <Cascader :data="data4" v-model="value" style="width:200px"></Cascader> -->
      </Col>
      <Col span="21">
      <Button type="primary" @click='cateshow'>添加数据</Button>
      <Button type="primary" @click='removes'>删除多个</Button>
      <Input v-model="searchBox" placeholder="Enter something..." style="width: 100px" />
      <Button type="primary" @click='onSearch'>Search</Button>
      <Table border :columns="columns" :data="data" @on-selection-change='onSelect'></Table>
      <Page :total="total" :page-size="rows" @on-change="onChangePage" :page-size-opts=[5,10,15,20] @on-page-size-change="onPageSizeChange" show-sizer /></Col>
      <Modal v-model="modalForm" title="数据操作">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="类别" prop="cateId" style="display:none">
            <Input v-model="formValidate.cateId"></Input>
          </FormItem>
          <FormItem label="商品名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入商品名称"></Input>
          </FormItem>
          <FormItem label="零售价" prop="retailPrice">
            <Input v-model="formValidate.retailPrice" placeholder="请输入零售价" number></Input>
          </FormItem>
          <FormItem label="进价" prop="purchasePrice">
            <Input v-model="formValidate.purchasePrice" placeholder="请输入进价" number></Input>
          </FormItem>
          <FormItem label="单位" prop="unit">
            <RadioGroup v-model="formValidate.unit">
              <Radio label="元">元</Radio>
              <Radio label="美元">美元</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="商品描述" prop="desc">
            <!-- <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input> -->
            <quill-editor v-model="formValidate.desc"></quill-editor>
          </FormItem>
          <FormItem label="日期" prop="date" style="display:none">
            <Input v-model="formValidate.date" placeholder=""></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
          </FormItem>
        </Form>
        <div slot="footer"></div>
      </Modal>
    </Row>
  </div>
</template>
<script>
import moment from 'moment';
export default {
  data() {
    return {
      module      : 'product',
      data4       : [],
      total       : 0,
      page        : 1,
      rows        : 5,
      modalForm   : false,
      ids         : [],
      searchBox   : '',
      data        : [],
      cateId      : '',
      formValidate: {
        cateId       : '',
        name         : '',
        desc         : '',
        retailPrice  : '',
        purchasePrice: '',
        unit         : ''
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message : 'The name cannot be empty',
            trigger : 'blur'
          }
        ],
        desc: [
          { required: true, message: 'Desc cannot be empty', trigger: 'blur' }
        ],
        retailPrice: [
          {
            type    : 'number',
            required: true,
            message : 'Please input the retailPrice',
            trigger : 'blur'
          }
        ],
        purchasePrice: [
          {
            type    : 'number',
            required: true,
            message : 'Please input purchasePrice',
            trigger : 'blur'
          }
        ],
        unit: [
          { required: true, message: 'Please input the unit', trigger: 'blur' }
        ]
      },
      columns: [
        {
          type : 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '产品名称',
          key  : 'name',
          align: 'center'
        },
        {
          title : '商品说明',
          key   : 'desc',
          align : 'center',
          render: function(h, params) {
            return h('div', {
              domProps: {
                innerHTML: params.row.desc,
              }
            });
          }
        },
        {
          title: '零售价',
          key  : 'retailPrice',
          align: 'center'
        },
        {
          title: '进价',
          key  : 'purchasePrice',
          align: 'center'
        },
        {
          title: '单位',
          key  : 'unit',
          align: 'center'
        },
        {
          title: '日期',
          key  : 'date',
          align: 'center'
        },
        {
          title : 'Action',
          key   : 'action',
          width : 150,
          align : 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.edit(params.row._id);
                    }
                  }
                },
                '修改'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row._id);
                    }
                  }
                },
                '删除'
              )
            ]);
          }
        }
      ]
    };
  },
  methods: {
    cateshow() {
      if (this.cateId != '') {
        this.modalForm = true;
         this.handleReset("formValidate");
         delete this.formValidate._id;
      } else {
        this.modalForm = false;
        this.$Message.error('请选择子分支');
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.formValidate._id) {
            var eDate                  = moment().format('YYYY-MM-DD HH:mm:ss');
                this.formValidate.date = eDate;
            this.axios({
              url: `http://localhost:3000/${this.module}/data/${
                this.formValidate._id
              }`,
              method: 'put',
              data  : this.formValidate
            }).then(res => {
              this.modalForm = false;
              this.getData();
              
            });
          } else {
            this.formValidate.cateId = this.cateId;
            this.axios({
              url   : `http://localhost:3000/${this.module}/data`,
              method: 'post',
              data  : this.formValidate
            }).then(res => {
              this.modalForm = false;
              this.axios({
                url   : `http://localhost:3000/${this.module}/list`,
                method: 'post',
                data  : {
                  cateId: this.cateId,
                  page  : this.page,
                  rows  : this.rows
                }
              }).then(res => {
                this.total = res.data.total;
                this.data  = res.data.rows;
              });
              this.formValidate = {};
            });
          }
        } else {
          this.$Message.error('Fail!');
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    edit(id) {
      // 请示数据，打开对话框，显示表单的数据，进行提交
      this.axios({
        url   : `http://localhost:3000/${this.module}/data/${id}`,
        method: 'get'
      }).then(res => {
        this.formValidate = res.data;
        this.modalForm    = true;
      });
    },
    remove(id) {
      this.$Modal.confirm({
        title  : '确认操作',
        content: '<p>你确认删除该记录吗?</p>',
        onOk   : () => {
          this.axios({
            url   : `http://localhost:3000/${this.module}/data/${id}`,
            method: 'delete'
          }).then(res => {
            this.getData();
          });
        },
        onCancel: () => {
          this.$Message.info('Clicked cancel');
        }
      });
    },
    getData() {
      if (this.cateId) {
        this.axios({
          url   : `http://localhost:3000/${this.module}/list`,
          method: 'post',
          data  : {
            cateId: this.cateId,
            page  : this.page,
            rows  : this.rows
          }
        }).then(res => {
          this.total = res.data.total;
          this.data  = res.data.rows;
        });
      } else {
        this.axios({
          url   : `http://localhost:3000/${this.module}/list`,
          method: 'post',
          data  : {
            page: this.page,
            rows: this.rows
          }
        }).then(res => {
          this.total = res.data.total;
          this.data  = res.data.rows;
        });
      }
    },
    onChangePage(page) {
      this.page = page;
      if (this.searchBox) {
        this.onSearch();
      } else {
        this.getData();
      }
    },
    onPageSizeChange(rows) {
      this.rows = rows;
      if (this.searchBox) {
        this.onSearch();
      } else {
        this.getData();
      }
    },
    onSelect(selections) {
      var ids = [];
      for (let i = 0; i < selections.length; i++) {
        ids.push(selections[i]._id);
      }
      this.ids = ids.toString();
    },
    removes() {
      this.$Modal.confirm({
        title  : '确认操作',
        content: '<p>你确认删除该记录吗?</p>',
        onOk   : () => {
          this.axios({
            url   : `http://localhost:3000/${this.module}/data/removes`,
            method: 'post',
            data  : {
              ids: this.ids
            }
          }).then(res => {
            this.getData();
          });
        },
        onCancel: () => {
          this.$Message.info('Clicked cancel');
        }
      });
    },
    onSearch() {
      this.axios({
        url   : `http://localhost:3000/${this.module}/list`,
        method: 'post',
        data  : {
          name: this.searchBox,
          page: 1,
          rows: this.rows
        }
      }).then(res => {
        this.total = res.data.total;
        this.data  = res.data.rows;
      });
      console.log(1);
    },
    getTree() {
      this.axios({
        url   : `http://localhost:3000/cate/list/4`,
        method: 'post'
      }).then(res => {
        this.data4 = res.data;
      });
    },
    onSelectChange(node) {
      this.cateId = node[0]._id;
      this.page   = 1;            //选择分支，显示分支内的数据并获取当前分支的ID
      this.axios({
        url   : `http://localhost:3000/${this.module}/list`,
        method: 'post',
        data  : {
          cateId: this.cateId,
          page  : this.page,
          rows  : this.rows
        }
      }).then(res => {
        this.total = res.data.total;
        this.data  = res.data.rows;
      });
    }
  },
  mounted() {
    this.getData();
    this.getTree();
  }
}; //10this.$Message.error('Fail!');
</script>

