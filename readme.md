# 一个家谱界面

使用了 d3.js

# next move

分离json 到gitee/阿里云服务器/oss/

支持 上述 分离的 json 的远程读取。

- [x] 完成 get_json_from_oss.js

`nodes.forEach(function(d){ d.y = 50 + d.depth * 80});` 这句降低了高度

本来：`nodes.forEach(function(d){ d.y = 50 + d.depth * 180});`