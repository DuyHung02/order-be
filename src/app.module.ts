import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entity/User';
import { Product } from './entity/Product';
import { Category } from './entity/Category';
import { Bill } from './entity/Bill';
import { BillProduct } from './entity/BillProduct';
import { Order } from './entity/Order';
import { Cart } from './entity/Cart';
import { Profile } from './profile/entity/Profile';
import { UserModule } from './user/user.module';
import { join } from 'path';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfileModule } from './profile/profile.module';
import { Otp } from './auth/entity/Otp';

@Module({
  imports: [
    UserModule,
    AuthModule,
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
        Bill,
        BillProduct,
        Order,
        Cart,
        Profile,
        Otp,
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
          secure: false,
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
    ProfileModule,
  ],
})
export class AppModule {}
