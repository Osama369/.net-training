import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { AutoFocusModule } from 'primeng/autofocus';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { AnimateModule } from 'primeng/animate';
import { SpeedDialModule } from 'primeng/speeddial';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { TagModule } from 'primeng/tag';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { FileUploadModule } from 'primeng/fileupload';
import { CheckboxModule } from 'primeng/checkbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DividerModule } from 'primeng/divider';
import { TreeTableModule } from 'primeng/treetable';
import { RecaptchaModule } from 'ng-recaptcha';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ChartModule } from 'primeng/chart';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { InputMaskModule } from 'primeng/inputmask';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TabViewModule } from 'primeng/tabview';
import { FieldsetModule } from 'primeng/fieldset';
import { TreeSelectModule } from 'primeng/treeselect';

@NgModule({
  exports: [
    TableModule,
    DropdownModule,
    AutoCompleteModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    CalendarModule,
    AutoFocusModule,
    ConfirmDialogModule,
    DialogModule,
    AnimateModule,
    SpeedDialModule,
    MultiSelectModule,
    ProgressBarModule,
    SliderModule,
    TagModule,
    ConfirmPopupModule,
    FileUploadModule,
    CheckboxModule,
    OverlayPanelModule,
    DividerModule,
    TreeTableModule,
    RecaptchaModule,
    InputSwitchModule,
    ChartModule,
    ToolbarModule,
    ToastModule,
    PasswordModule,
    InputMaskModule,
    ReactiveFormsModule,
    FormsModule,
    MessagesModule,
    MessageModule,
    TranslateModule,
    TabViewModule,
    FieldsetModule,
    TreeSelectModule
  ]
})
export class PrimeNgModule { }
