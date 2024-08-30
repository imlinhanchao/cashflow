import { ApiProperty } from "@nestjs/swagger";
import { DataSourceDto as DataSourceDto } from "src/core/Dto/common.dto";

export class ReportDto {
  @ApiProperty({
    name: "username",
    description: "用户名",
    example: "047f9a52-68e4-4300-8748-70f71267413e",
  })
  username: string;

  @ApiProperty({ name: "name", description: "名称" })
  name: string;

  @ApiProperty({ name: "description", description: "描述" })
  description: string;

  @ApiProperty({ name: "public", description: "是否公开" })
  public: boolean;

  @ApiProperty({ name: "datasrc", description: "数据源" })
  datasrc: DataSourceDto;

  @ApiProperty({ name: "options", description: "Echart配置" })
  options: string;
}
