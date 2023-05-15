import { Module } from "@nestjs/common";
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entity/User';
import { Product } from './product/entity/Product';
import { Category } from './category/entity/Category';
import { Order } from './order/entity/Order';
import { Profile } from './profile/entity/Profile';
import { UserModule } from './user/user.module';
import { join } from 'path';
import { HandlebarsAdapter, MailerModule } from "@nest-modules/mailer";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfileModule } from './profile/profile.module';
import { Otp } from './auth/entity/Otp';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { Cart } from './cart/entity/Cart';
import { CartProduct } from './entity/CartProduct';
import { CartModule } from './cart/cart.module';
import { JwtModule } from "@nestjs/jwt";
import { OrderModule } from "./order/order.module";
import { OrderDetail } from "./entity/OrderDetail";
import { Role } from "./user/entity/Role";

@Module({
  imports: [
    ProfileModule,
    ProductModule,
    CategoryModule,
    UserModule,
    CartModule,
    AuthModule,
    OrderModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'order_here',
      entities: [
        User,
        Product,
        Category,
        Cart,
        CartProduct,
        Order,
        OrderDetail,
        Profile,
        Otp,
        Role,
      ],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: true,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'src/template/email'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
})
export class AppModule{
}
