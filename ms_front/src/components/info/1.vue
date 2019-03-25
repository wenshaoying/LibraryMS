<template>
    <div>
        <h1 class="newstitle" v-model="newstitle">新闻类型：{{newstitle}}</h1>

        <Tree :data="treedata" @on-select-change="onSelectChange"></Tree>
        <!-- <Tree :data="data1" :render="renderContent"></Tree> -->
        <Button type="primary" @click="modalForm = true">添加数据</Button>
        <Button type="primary" @click="removes">删除多个</Button>
        <Input suffix="ios-search" placeholder="Enter text" style="width: auto" v-model="searchBox"/>
        <Button type="primary" @click="onSearch">search</Button>

        <Table border :columns="columns" :data="data" @on-selection-change="onSelect"></Table>
        <Page :total="total" :page-size="rows" @on-change="onChangePage" :page-size-opts=[5,10,15,20] @on-page-size-change="onPageSizeChange" show-sizer />

        <Modal v-model="modalForm" title="数据操作">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="标题" prop="title">
                    <Input v-model="formValidate.title" placeholder="请输入标题"></Input>
                </FormItem>              
                <FormItem label="来源" prop="source">
                    <Input v-model="formValidate.source" placeholder="信息来源"></Input>
                </FormItem>
                <FormItem label="作者" prop="author">
                    <Input v-model="formValidate.author" placeholder="作者"></Input>
                </FormItem>
                <FormItem label="分类" prop="cate">
                    <Input v-model="formValidate.cate" placeholder="分类"></Input>
                </FormItem>
                <FormItem label="发布时间" prop="date">
                    <Input v-model="formValidate.date" placeholder="发布时间"></Input>
                </FormItem>
                <FormItem label="是否发布" prop="isPublish">
                    <Input v-model="formValidate.isPublish" placeholder="是否发布"></Input>
                <!-- <Select v-model="formValidate.type" :disabled="disabled">
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>    -->
                </FormItem>
                <FormItem label="是否置顶" prop="isTop">
                    <Input v-model="formValidate.isTop" placeholder="是否置顶"></Input>
                       <!-- <Select v-model="formValidate.type" :disabled="disabled">
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>    -->
                </FormItem>
                <FormItem label="是否热搜" prop="isHot">
                     <!-- <Select v-model="formValidate.type" :disabled="disabled">
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>    -->
                    <Input v-model="formValidate.isHot" placeholder="是否热搜"></Input>
                </FormItem>
                <FormItem label="内容" prop="content">
                    <Input v-model="formValidate.content" placeholder="请输入内容"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
                    <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                </FormItem>
            </Form>
            <div slot="footer">
                是否立即发布新闻呢？
            </div>
        </Modal>
      <div slot="footer">
      </div>
    </Modal>
    </div>

</template>
<script>
import Base from '../../base/Base';
// import moment from 'moment';
export default {
  mixins: [Base],
  data() {
    return {
       newstitle:'',
      searchBox:" ",
        treedata:[],
        module      : 'news',
      //  disabled : false,
      //  cityList : [
      //               {
      //                   value: 1,
      //                   label: '是'
      //               },
      //               {
      //                   value: 2,
      //                   label: '否'
      //               },                  
      //           ],
      formValidate: {
        title: ''
      },
      ruleValidate: {
        title: [
          {
            required: true,
            message : '必须输入标题',
            trigger : 'blur'
          }
        ],
        content: [
          {
            required: true,
            message : '必须输入内容',
            trigger : 'blur'
          }
        ],
        source: [
          {
            required: true,
            message : '来源',
            trigger : 'blur'
          }
        ],
        author: [
          {
            required: true,
            message : '作者',
            trigger : 'blur'
          }
        ]
      },
      columns: [
        {
          type : 'selection',
          width: 50,
          align: 'center'
        },
        {
          title: '标题',
          key  : 'title'
        },
        {
         title: '内容',
          key  : 'content'
        },
        {
          title: '来源',
          key  : 'source'
        },
        {
          title: '分类',
          key  : 'cate'
        },
        {
          title: '作者',
          key  : 'author'
        },
        {
          title: '发布时间',
          key  : 'date'
        },
        {
          title: '是否发布',
          key  : 'isPublish'
        },
        {
          title: '是否置顶',
          key  : 'isTop'
        },
        {
          title: '是否热搜',
          key  : 'isHot'
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
                     
                    }
                  }
                },
                '评论'
              ),
            ]);
          }
        }
      ]
    };
  }, 
    methods:{
      getTree(){
        this.axios({
          url:'http://localhost:3000/cate/list/1',
          method:'post'
        }).then(res=>{
          this.treedata=res.data;
        })
      },
      onSelectChange(node){
        this.newstitle=node[0].title;
      console.log(node)

      this.axios({
        url   : `http://localhost:3000/${this.module}/list/`,
        method: 'post',
        data  : {
          page: this.page,
          rows: this.rows,
          newsId:node[0]._id
        }
      }).then(res => {      
        this.total = res.data.total;
        this.data  = res.data.rows;
      });

      this.formValidate.newsId=node[0]._id;
      this.handleSubmit();

      this.onChangePage();
      this.onPageSizeChange();
      
      },
       getData() {
            this.axios({
                url: `http://localhost:3000/news/list`,
                method: 'post',
                data: {
                    page: this.page,
                    rows: this.rows
                }
            }).then(res => {
                this.total = res.data.total;
                this.data = res.data.rows;
                // console.log(this.data[1].cate);
            });
        },
        onSearch(){
          this.axios({
                url: `http://localhost:3000/news/list`,
                method: 'post',
                data: {
                    name: this.searchBox,
                    page: 1,
                    rows: this.rows
                }
            }).then(res => {
                this.total = res.data.total;
                this.data = res.data.rows;
            });
        }
    },
    mounted() {
      this.getTree();
    },
};
</script>



<template>
    <Cascader :data="data" :value.sync="value1"></Cascader>
</template>
<script>
    export default {
        data () {
            return {
                value1: [],
                data: [{
                    value: 'beijing',
                    label: '北京',
                    children: [
                        {
                            value: 'gugong',
                            label: '故宫'
                        },
                        {
                            value: 'tiantan',
                            label: '天坛'
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井'
                        }
                    ]
                }, {
                    value: 'jiangsu',
                    label: '江苏',
                    children: [
                        {
                            value: 'nanjing',
                            label: '南京',
                            children: [
                                {
                                    value: 'fuzimiao',
                                    label: '夫子庙',
                                }
                            ]
                        },
                        {
                            value: 'suzhou',
                            label: '苏州',
                            children: [
                                {
                                    value: 'zhuozhengyuan',
                                    label: '拙政园',
                                },
                                {
                                    value: 'shizilin',
                                    label: '狮子林',
                                }
                            ]
                        }
                    ],
                }]
            }
        }
    }
</script>
