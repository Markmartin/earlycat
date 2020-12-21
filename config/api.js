// 以下是业务服务器API地址
// 本机开发时使用
//  var WxApiRoot = 'http://localhost:8080/wx/';
// 局域网测试使用
//var WxApiRoot = 'http://106.15.47.90:8080/wx/';
// 云平台部署时使用
const { WxApiRoot } = require('./variable')
// 云平台上线时使用
// var WxApiRoot = 'https://wali.xiaolaba.net.cn/wx/';

//var WxWebSocketRoot = 'wss://106.15.47.90:8080/wx/';
var WxWebSocketRoot = 'wss://wali.xiaolaba.net.cn/wx/'

module.exports = {
  QRCODE: WxWebSocketRoot + 'socket/', //建立socket链接
  OPenholderReset: WxApiRoot + 'open/holderReset', //刷新户主开门二维码串
  OPenshare: WxApiRoot + 'open/share', //户主分享小程序接口
  OPenvisitorReset: WxApiRoot + 'open/visitorReset', //刷新访客开门二维码串
  OPenRecordList: WxApiRoot + 'open/record/list', //开门记录
  OPenVisitRecordList: WxApiRoot + 'open/visit/record/list', //开门记录

  AuthLoginByWeixin: WxApiRoot + 'auth/login_by_weixin', //微信登录
  AuthLoginByWeixinCode: WxApiRoot + 'auth/login_by_weixin_code', //微信code登录
  AuthLoginByAccount: WxApiRoot + 'auth/login', //账号登录

  AuthLogout: WxApiRoot + 'auth/logout', //账号登出
  AuthRegister: WxApiRoot + 'auth/register', //账号注册
  AuthReset: WxApiRoot + 'auth/reset', //账号密码重置
  AuthRegisterCaptcha: WxApiRoot + 'auth/regCaptcha', //验证码
  AuthBindPhone: WxApiRoot + 'auth/bindPhone', //绑定微信手机号
  AuthGetPhone: WxApiRoot + 'auth/getPhone', //获取微信手机号

  // 社区圈子
  MomentList: WxApiRoot + 'moment/list', //动态列表
  MomentDetail: WxApiRoot + 'moment/detail', //动态详情
  MomentPost: WxApiRoot + 'moment/post', //发布动态
  MomentShares: WxApiRoot + 'moment/shares', //分享数
  // 社区话题
  CircleList: WxApiRoot + 'circle/list', //社区话题列表分页查询
  CircleDetail: WxApiRoot + 'circle/detail', //社区话题详情查询
  CircleSave: WxApiRoot + 'circle/save', //社区话题新增
  CircleMyList: WxApiRoot + 'circle/myList', //我的社区话题列表分页查询

  // 社区接口
  CommunityHouseholdList: WxApiRoot + 'community/household/list', //家庭成员列表
  CommunityBuildingsSelf: WxApiRoot + 'community/buildings/self', //我的楼栋列表
  CommunityUserbuildingAdd: WxApiRoot + 'community/userbuilding/add', //添加家庭成员关系
  CommunityUserbuildingDelete: WxApiRoot + 'community/userbuilding/delete', //删除家庭成员关系
  CommunityDetail: WxApiRoot + 'community/detail', //社区详情
  CommunityListAll: WxApiRoot + 'community/list/all', //全局社区列表
  CommunityListSelf: WxApiRoot + 'community/list/self', //我的社区列表
  CommunityActive: WxApiRoot + 'community/active', //切换社区
  CommunityBinding: WxApiRoot + 'community/binding', //绑定小区
  CommunityAround: WxApiRoot + 'community/around', //附近小区
  CommunitySync: WxApiRoot + 'community/sync', //同步小区
  CommunitySyncBinding: WxApiRoot + 'community/sync-binding', //同步小区
  CommunityDelete: WxApiRoot + 'community/delete', //删除小区
  CommunityWxgroupcode: WxApiRoot + 'community/wxgroupcode', //获取群二维码

  //社区大妈
  IM: WxWebSocketRoot + 'im', //建立socket链接
  MessageList: WxApiRoot + 'message/list', //查询分页消息记录

  //公告
  NoticeList: WxApiRoot + 'notice/list', //公告列表
  NoticeDetail: WxApiRoot + 'notice/detail', //公告详情

  // 对象储存服务
  StorageUpload: WxApiRoot + 'storage/upload', //图片上传,

  CommentList: WxApiRoot + 'comment/list', //评论列表
  CommentPost: WxApiRoot + 'comment/post', //发表评论
  LikeList: WxApiRoot + 'like/list', //点赞列表
  LikePost: WxApiRoot + 'like/post', //点赞

  WelfareList: WxApiRoot + 'welfare/list', //福利接口
  WelfareDetail: WxApiRoot + 'welfare/detail', //福利详情

  ActivityList: WxApiRoot + 'activity/list', //活动接口
  ActivityDetail: WxApiRoot + 'activity/detail', //活动详情
  ActivitySave: WxApiRoot + 'activity/save', //活动新增
  ActivityUpdate: WxApiRoot + 'activity/update', //活动信息修改

  // 积分
  GoodsDetail: WxApiRoot + 'goods/detail', //积分商品详情

  // 设置
  AddressList: WxApiRoot + 'address/list', //收货地址列表
  AddressDetail: WxApiRoot + 'address/detail', //收货地址详情
  AddressSave: WxApiRoot + 'address/save', //保存收货地址
  AddressDelete: WxApiRoot + 'address/delete', //保存收货地址

  // 旧物置换
  SecondhandList: WxApiRoot + 'secondhand/list', //列表
  SecondhandDetail: WxApiRoot + 'secondhand/detail', //详情
  SecondhandPost: WxApiRoot + 'secondhand/post', //发布
  SecondhandShares: WxApiRoot + 'secondhand/shares', //动态

  IndexUrl: WxApiRoot + 'home/index', //首页数据接口

  GoodsList: WxApiRoot + 'goods/list', //获得商品列表
  GoodsCount: WxApiRoot + 'goods/count', //统计商品总数
  GoodsCategory: WxApiRoot + 'goods/category', //获得分类数据
  GoodsRelated: WxApiRoot + 'goods/related', //商品详情页的关联商品（大家都在看）

  BrandList: WxApiRoot + 'brand/list', //品牌列表
  BrandDetail: WxApiRoot + 'brand/detail', //品牌详情

  CatalogList: WxApiRoot + 'catalog/index', //分类目录全部分类数据接口
  CatalogCurrent: WxApiRoot + 'catalog/current', //分类目录当前分类数据接口

  CartList: WxApiRoot + 'cart/index', //获取购物车的数据
  CartAdd: WxApiRoot + 'cart/add', // 添加商品到购物车
  CartFastAdd: WxApiRoot + 'cart/fastadd', // 立即购买商品
  CartUpdate: WxApiRoot + 'cart/update', // 更新购物车的商品
  CartDelete: WxApiRoot + 'cart/delete', // 删除购物车的商品
  CartChecked: WxApiRoot + 'cart/checked', // 选择或取消选择商品
  CartGoodsCount: WxApiRoot + 'cart/goodscount', // 获取购物车商品件数
  CartCheckout: WxApiRoot + 'cart/checkout', // 下单前信息确认

  CollectList: WxApiRoot + 'collect/list', //收藏列表
  CollectAddOrDelete: WxApiRoot + 'collect/addordelete', //添加或取消收藏

  CommentCount: WxApiRoot + 'comment/count', //评论总数

  TopicList: WxApiRoot + 'topic/list', //专题列表
  TopicDetail: WxApiRoot + 'topic/detail', //专题详情
  TopicRelated: WxApiRoot + 'topic/related', //相关专题

  SearchIndex: WxApiRoot + 'search/index', //搜索关键字
  SearchResult: WxApiRoot + 'search/result', //搜索结果
  SearchHelper: WxApiRoot + 'search/helper', //搜索帮助
  SearchClearHistory: WxApiRoot + 'search/clearhistory', //搜索历史清楚

  ExpressQuery: WxApiRoot + 'express/query', //物流查询

  RegionList: WxApiRoot + 'region/list', //获取区域列表

  OrderSubmit: WxApiRoot + 'order/submit', // 提交订单
  OrderPrepay: WxApiRoot + 'order/prepay', // 订单的预支付会话
  OrderList: WxApiRoot + 'order/list', //订单列表
  OrderDetail: WxApiRoot + 'order/detail', //订单详情
  OrderCancel: WxApiRoot + 'order/cancel', //取消订单
  OrderRefund: WxApiRoot + 'order/refund', //退款取消订单
  OrderDelete: WxApiRoot + 'order/delete', //删除订单
  OrderConfirm: WxApiRoot + 'order/confirm', //确认收货
  OrderGoods: WxApiRoot + 'order/goods', // 代评价商品信息
  OrderComment: WxApiRoot + 'order/comment', // 评价订单商品信息

  FeedbackAdd: WxApiRoot + 'feedback/submit', //添加反馈
  FootprintList: WxApiRoot + 'footprint/list', //足迹列表
  FootprintDelete: WxApiRoot + 'footprint/delete', //删除足迹

  UserFormIdCreate: WxApiRoot + 'formid/create', //用户FromId，用于发送模版消息

  GroupOnList: WxApiRoot + 'groupon/list', //团购列表
  GroupOnMy: WxApiRoot + 'groupon/my', //团购API-我的团购
  GroupOnDetail: WxApiRoot + 'groupon/detail', //团购API-详情
  GroupOnJoin: WxApiRoot + 'groupon/join', //团购API-详情

  CouponList: WxApiRoot + 'coupon/list', //优惠券列表
  CouponMyList: WxApiRoot + 'coupon/mylist', //我的优惠券列表
  CouponSelectList: WxApiRoot + 'coupon/selectlist', //当前订单可用优惠券列表
  CouponReceive: WxApiRoot + 'coupon/receive', //优惠券领取
  CouponExchange: WxApiRoot + 'coupon/exchange', //优惠券兑换

  UserIndex: WxApiRoot + 'user/index', //个人页面用户相关信息
  IssueList: WxApiRoot + 'issue/list', //帮助信息
  WxCode: WxApiRoot + 'community/wxcode', //小区的小程序码
  AdDetail: WxApiRoot + 'ad/detail', //站外接口

  answerDetail: WxApiRoot + 'answer/detail', //问卷明细
  answerAnswer: WxApiRoot + 'answer/answer', //答卷

  businessList: WxApiRoot + 'business/info/list', //商户服务列表
  businessdetail: WxApiRoot + '/business/info/detail', //商户信息
  businessShares: WxApiRoot + 'business/info/shares', //分享数+1
  businessadd: WxApiRoot + 'business/info/add', //新增商户服务

  incomeList: WxApiRoot + 'income/list', //收益明细
  incomeOrders: WxApiRoot + 'income/orders', //推广订单
  incomeStat: WxApiRoot + 'income/stat', //我的收益统计
  incomeUsers: WxApiRoot + 'income/users', //邀请用户记录
  incomeWithdraw: WxApiRoot + 'income/withdraw', //提现申请

  userInfo: WxApiRoot + 'user/info', //获取用户信息
  orderInvitelist: WxApiRoot + 'order/invitelist', //推广订单
  GoodsShare: WxApiRoot + 'goods/share' //分享海报
}
