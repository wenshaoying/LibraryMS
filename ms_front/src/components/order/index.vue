<template>
 <div>
     <Row>
         <Col span="3">
     <Tree :data="treedata" @on-select-change="onSelectChange"></Tree>
    <!-- <Button type="primary" @click="modalForm = true">添加数据</Button> -->
    </Col>
    <Col span="21">
    <Button type="primary" @click='cateshow'>添加数据</Button>
    <Button type="primary" @click="removes">删除多个</Button>
    <Input suffix="ios-search" placeholder="Enter text" style="width: auto" v-model="searchBox"/>
    <Button type="primary" @click="onSearch">search</Button>

    <Table border :columns="columns" :data="data" @on-selection-change="onSelect"></Table>
    <Page :total="total" :page-size="rows" @on-change="onChangePage" :page-size-opts=[5,10,15,20] @on-page-size-change="onPageSizeChange" show-sizer />
    </Col>
    <Modal v-model="modalForm" title="数据操作">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="订单号" prop="orderId">
          <Input v-model="formValidate.orderId" placeholder="请输入订单号"></Input>
        </FormItem>
        <FormItem label="收件人" prop="recipient">
          <Input v-model="formValidate.recipient" placeholder="收件人姓名"></Input>
        </FormItem>
        <FormItem label="用户ID" prop="userId">
          <Input v-model="formValidate.userId" placeholder="用户ID" number></Input>
        </FormItem>
        <FormItem label="物品名称" prop="goodsName">
          <Input v-model="formValidate.goodsName" placeholder="物品名称"></Input>
        </FormItem>
        <!-- <FormItem label="订单状态" prop="orderStatus">
          <Input v-model="formValidate.orderStatus" placeholder="订单状态"></Input>
        </FormItem> -->
         <FormItem label="订单状态" prop="orderStatus">
            <Select  v-model="formValidate.orderStatus" placeholder="订单状态">
                <!-- <Option value="已支付">已支付</Option>
                <Option value="未支付">未支付</Option>
                <Option value="已发货">已发货</Option>
                <Option value="已完成">已完成</Option> -->
                <Option :value='cateTitle'>{{cateTitle}}</Option>
            </Select>
        </FormItem>
        <FormItem label="订单总价" prop="price">
          <Input v-model="formValidate.price" placeholder="订单总价" number></Input>
        </FormItem>
        <FormItem label="创建时间" prop="creatTime">
            <Input v-model="formValidate.creatTime" placeholder="时间"></Input>
          <!-- <span>{{dateBegin | formatDate}}</span> -->
        </FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
        </FormItem>
      </Form>
      <!-- <div slot="footer">
        我就不显示按钮
      </div> -->
    </Modal>
    </Row>
  </div>
</template>
<script>
import Base from '../../base/Base';
// import moment from 'moment';
    export default {
        mixins: [Base],
        data() {
            return {
                searchBox   : "",
                module      : 'order',
                cateId      : '',
                cateTitle   : '',
                treedata    : [],
                modalForm   : false,
                formValidate: {
                orderId    : '',
                recipient  : '',
                orderStatus: '',
                price      : '',
                creatTime  : '',
                cateId     : '',
                cateTitle  : '',
            },
            ruleValidate: {
                orderId: [
                {
                    required: false,
                    trigger : 'blur'
                }
                ],
                recipient: [
                {
                    required: true,
                    message : '必须输入收件人',
                    trigger : 'blur'
                }
                ],
                userId: [
                {
                    type    : 'number',
                    required: true,
                    message : '必须输入用户ID',
                    trigger : 'blur'
                }
                ],
                goodsName: [
                {
                    required: true,
                    message : '必须输入用户ID',
                    trigger : 'blur'
                }
                ],
                orderStatus: [
                {
                    required: false,
                    message : '必须输入订单状态',
                    trigger : 'blur'
                }
                ],
                price: [
                {
                    type    : 'number',
                    required: true,
                    message : '必须输入订单总价',
                    trigger : 'blur'
                }
                ],
                creatTime: [
                {
                    required: false,
                    trigger : 'blur'
                }
                ]
            },
            columns: [
                {
                type : 'selection',
                width: 60,
                align: 'center'
                },
                {
                title: '订单号',
                key  : 'orderId'
                },
                {
                title: '用户ID',
                key  : 'userId'
                },
                {
                title: '物品名称',
                key  : 'goodsName'
                },
                {
                title: '收件人',
                key  : 'recipient'
                },
                {
                title: '订单状态',
                key  : 'orderStatus'
                },
                {
                title: '订单总价',
                key  : 'price'
                },
                {
                title: '创建时间',
                key  : 'creatTime'
                },
                {
                title : '操作',
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
         methods:{
    getTree(){
      this.axios({
        url   : 'http://localhost:3000/cate/list/3',
        method: 'post'
      }).then(res=>{
        this.treedata = res.data;
      })
    },
    onSelectChange(node){
    //   console.log(node[0].title);
    this.cateId    = node[0]._id;
    this.cateTitle = node[0].title;
    this.page      = 1;
    this.axios({
            url   : `http://localhost:3000/${this.module}/list`,
            method: 'post',
            data  : {
                cateId   : this.cateId,
                cateTitle: this.cateTitle,
                page     : this.page,
                rows     : this.rows
            }
        }).then(res => {
            this.total = res.data.total;
            this.data  = res.data.rows;
        })
    },
    cateshow(){
         if (this.cateId !='') {
        this.modalForm = true;
      } else {
        this.modalForm = false;
        this.$Message.error('请选择子分支');
      }
    },
    getData() {
        if(this.cateId){
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
        }else{
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
     handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.formValidate._id) {
            // var eDate                  = moment().format('YYYY-MM-DD HH:mm:ss');
            //     this.formValidate.date = eDate;
            this.axios({
              url: `http://localhost:3000/${this.module}/data/${
                this.formValidate._id
              }`,
              method: 'put',
              data  : this.formValidate
            }).then(res => {
              this.modalForm = false;
              this.getData();
            //    数据重置
            //  this.$data.formValidate = this.$options.data().formValidate;
            this.formValidate = {};
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
     onSearch() {
            this.axios({
                url   : `http://localhost:3000/${this.module}/list`,
                method: 'post',
                data  : {
                    name: this.searchBox,
                    page: this.page,
                    rows: this.rows
                }
            }).then(res => {
                this.total = res.data.total;
                this.data  = res.data.rows;
            });
        }
  },
  mounted() {
    this.getTree();
  }

}
</script>

