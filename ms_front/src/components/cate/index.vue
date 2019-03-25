<template>
<div>

    <Button type="primary" @click="getData(1)">新闻分类</Button>
    <Button type="primary" @click="getData(3)">订单分类</Button>
    <Button type="primary" @click="getData(4)">产品分类</Button>
    <Button type="success" @click="addCate()">添加分类</Button>
    <Tree :data="data" :render="renderContent"></Tree>
    <!-- <Tabs type="card">

       
        <TabPane  :label="'新闻分类'">
            <Tree :data="data1" :render="renderContent"></Tree>
        </TabPane>
       
        <TabPane  :label="'订单分类'">
            <Tree :data="data3" :render="renderContent"></Tree>
        </TabPane>
        <TabPane  :label="'产品分类'">
            <Tree :data="data4" :render="renderContent"></Tree>
        </TabPane>
        <Button @click="addCate()" size="small" slot="extra" type="success">增加分类</Button>
    </Tabs> -->


    <Modal v-model="modalForm" title="数据编辑">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="类型" prop="type">
          <!-- <Input v-model="formValidate.type" ></Input> -->
            <Select v-model="formValidate.type" :disabled="disabled">
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="上级分类" prop="parentId" style="display:none">
          <Input v-model="formValidate.parentId"></Input>
        </FormItem>
        <FormItem label="类名" prop="title">
          <Input v-model="formValidate.title" placeholder="请输入类名"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
        </FormItem>
      </Form>
      <div slot="footer">
      </div>
    </Modal>
</div>
</template>
<script>
//
    export default {
        data () {
            return {
                data: [],
                // data1: [ ],
                // data2: [ ],
                // data3    : [ ],
                // data4    : [ ],
                ids      : [],
                modalForm: false,
                disabled : false,
                cityList : [
                    {
                        value: 1,
                        label: '新闻分类'
                    },
                    {
                        value: 3,
                        label: '订单分类'
                    },
                    {
                        value: 4,
                        label: '产品分类'
                    },
                    
                ],
                buttonProps: {
                    type: 'default',
                    size: 'small',
                },
                formValidate: {
                    type    : '',
                    parentId: '',
                    title   : ''
                },
                ruleValidate: {
                    type: [
                    {
                        required: true,
                        message : '请选择类型',
                        // trigger : 'blur'
                    }
                    ],
                    parentId: [
                    {
                        required: false,
                    }
                    ],
                    title: [
                    {
                        required: true,
                        message : '请输入类名',
                        // trigger : 'blur'
                    }
                    ]
                },
            }
        },
        methods: {

            handleTabsAdd () {
                this.tabs ++;
            },
           
            getData(type) {
                
                this.axios({
                    url   : `http://localhost:3000/cate/list/${type}`,
                    method: 'post',
                
                }).then(res => {
                    // switch(type){
                    //     case 1      : this.data1 = res.data; break;
                       
                    //     case 3      : this.data3 = res.data; break;
                    //     case 4      : this.data4 = res.data; break;
                        
                    // } 
                    this.data = res.data;
                    
                });
               
            },
            
            renderContent (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width  : '100%'
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                // type: 'ios-paper-outline'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', data.title)
                    ]),
                    h('span', {
                        style: {
                            display    : 'inline-block',
                            float      : 'right',
                            marginRight: '32px'
                        }
                    }, [
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
                                this.append(data._id);
                                }
                            }
                            },
                            '添加子类'
                        ),
                        h(
                            'Button',
                            {
                            props: {
                                type: 'warning',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                this.edit(data._id);
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
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                this.remove(root, node, data);
                                }
                            }
                            },
                            '删除'
                        ),
                    ])
                ]);
            },
            //添加分类
            addCate(){
                this.disabled = false;
                this.handleReset('formValidate');
                this.formValidate.parentId = '';
                delete this.formValidate._id;
                this.modalForm = true;
            },
            //添加子类
            append (id) {
                this.disabled = true;
                this.handleReset('formValidate');
                this.axios({
                    url   : `http://localhost:3000/cate/data/${id}`,
                    method: 'get'
                }).then(res => {
                    this.formValidate.type     = res.data.type;
                    this.formValidate.parentId = res.data._id;
                    delete this.formValidate._id;
                    // console.log(this.formValidate);
                    this.modalForm = true;
                });
                console.log(id);

            },
            //修改
            edit(id){
                this.disabled = true;
                // 请示数据，打开对话框，显示表单的数据，进行提交
                this.axios({
                    url   : `http://localhost:3000/cate/data/${id}`,
                    method: 'get'
                }).then(res => {
                    this.formValidate = res.data;
                    this.modalForm    = true;
                });
            },
            //获取节点及其子节点id
            getIdList(node){
                
                this.ids.push(node._id);
                console.log(node);
                if(node.children){
                    for(let i=0;i<node.children.length;i++){
                        this.getIdList(node.children[i]);
                    }
                }
                
            },
            //删除
            remove (root, node, data) {
                this.ids = [];
                this.getIdList(node.node);
                //  console.log(this.ids.toString());
                 this.$Modal.confirm({
                    title  : '确认操作',
                    content: '<p>你确认删除该记录吗?</p>',
                    onOk   : () => {
                        
                       
                        this.axios({
                            url   : `http://localhost:3000/cate/data/removes`,
                            method: 'post',
                            data  : {
                                ids: this.ids.toString()
                            }
                        }).then(res => {
                            // console.log(root);
                            // const parentKey = root.find(el => el === node).parent;
                            // const parent    = root.find(el => el.nodeKey === parentKey).node;
                            // const index     = parent.children.indexOf(data);
                            // parent.children.splice(index, 1);
                            this.getData(data.type);
                        });
                    },
                    onCancel: () => {
                    this.$Message.info('Clicked cancel');
                    }
                });
            },
             handleSubmit(name) {
                this.$refs[name].validate(valid => {
                    console.log(valid);
                    if (valid) {
                    if (this.formValidate._id) {
                        this.axios({
                        url: `http://localhost:3000/cate/data/${
                            this.formValidate._id
                        }`,
                        method: 'put',
                        data  : this.formValidate
                        }).then(res => {
                        this.modalForm = false;
                        this.getData(this.formValidate.type);
                        });
                    } else {
                        if(this.formValidate.parentId==''){
                            delete this.formValidate.parentId;
                        }
                        // console.log(this.formValidate);
                        this.axios({
                        url   : `http://localhost:3000/cate/data`,
                        method: 'post',
                        data  : this.formValidate
                        }).then(res => {
                        this.modalForm = false;
                        this.getData(this.formValidate.type);
                        });
                    }
                    } else {
                    this.$Message.error('Fail!');
                    }
                });
            },
            handleReset(name) {
            this.$refs[name].resetFields();
            }
        },
        mounted() {
            this.getData(1);
           
        }
    }
</script>

